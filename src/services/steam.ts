export const STEAM_SPY_API = 'https://steamspy.com/api.php';
export const STEAM_STORE_API = 'https://store.steampowered.com/api';

export interface SteamSpyGame {
    appid: number;
    name: string;
    developer: string;
    publisher: string;
    score_rank: string;
    positive: number;
    negative: number;
    userscore: number;
    owners: string;
    average_forever: number;
    average_2weeks: number;
    median_forever: number;
    median_2weeks: number;
    price: string;
    initialprice: string;
    discount: string;
    ccu: number;
}

export interface SteamGameDetails {
    type: string;
    name: string;
    steam_appid: number;
    required_age: number;
    is_free: boolean;
    detailed_description: string;
    about_the_game: string;
    short_description: string;
    supported_languages: string;
    header_image: string;
    capsule_image: string;
    capsule_imagev5: string;
    website: string | null;
    pc_requirements: any;
    mac_requirements: any;
    linux_requirements: any;
    developers: string[];
    publishers: string[];
    price_overview?: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
    };
    platforms: {
        windows: boolean;
        mac: boolean;
        linux: boolean;
    };
    metacritic?: {
        score: number;
        url: string;
    };
    categories: { id: number; description: string }[];
    genres: { id: string; description: string }[];
    screenshots: { id: number; path_thumbnail: string; path_full: string }[];
    movies?: { id: number; name: string; thumbnail: string; webm: { max: string; '480': string }; mp4: { max: string; '480': string } }[];
    recommendations?: { total: number };
    release_date: { coming_soon: boolean; date: string };
    background: string;
    background_raw: string;
}

export const steamApi = {
    // Получить популярные игры со SteamSpy (топ за 2 недели)
    getPopularGames: async (): Promise<SteamSpyGame[]> => {
        try {
            const res = await fetch(`${STEAM_SPY_API}?request=top100in2weeks`, {
                next: { revalidate: 3600 * 24 } // кэшируем на сутки
            });
            if (!res.ok) throw new Error('SteamSpy fetch failed');
            const data = await res.json();
            return Object.values(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Получить детальную информацию по игре
    getGameDetails: async (appId: number | string): Promise<SteamGameDetails | null> => {
        try {
            const res = await fetch(`${STEAM_STORE_API}/appdetails?appids=${appId}&l=russian`, {
                next: { revalidate: 3600 * 24 }
            });
            if (!res.ok) throw new Error('Steam Store fetch failed');
            const data = await res.json();
            
            // API возвращает объект { [appId]: { success: boolean, data: SteamGameDetails } }
            const gameData = data[appId.toString()];
            if (gameData && gameData.success) {
                return gameData.data as SteamGameDetails;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // Получить список игр и сразу подгрузить для них полные детали (идеально для каталога)
    getGamesWithDetails: async (page: number = 1, limit: number = 20): Promise<{ results: SteamGameDetails[], total_pages: number }> => {
        try {
            const start = (page - 1) * limit;
            
            const fetchSearchPage = async (url: string) => {
                const res = await fetch(url, { next: { revalidate: 3600 * 24 } });
                const text = await res.text();
                const ids: string[] = [];
                const regex = /data-ds-appid="(\d+)"/g;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    ids.push(match[1]);
                }
                return ids;
            };

            // Собираем популярные новинки и лидеры продаж с учетом пагинации
            const [popularNew, topSellers] = await Promise.all([
                fetchSearchPage(`https://store.steampowered.com/search/results?q=&category1=998&filter=popularnew&page=${page}`),
                fetchSearchPage(`https://store.steampowered.com/search/results?q=&category1=998&filter=topsellers&page=${page}`)
            ]);
            
            // Объединяем, чередуя новинки и хиты продаж для разнообразия, убираем дубликаты
            const combinedIds = Array.from(new Set([...popularNew, ...topSellers])).slice(0, limit);
            
            // Запрашиваем детали параллельно
            const detailsPromises = combinedIds.map(id => steamApi.getGameDetails(id));
            const detailsResults = await Promise.all(detailsPromises);
            
            // Фильтруем null
            const validGames = detailsResults.filter((game): game is SteamGameDetails => game !== null && game.type === 'game');
            
            return {
                results: validGames,
                total_pages: 50 // Steam typically limits deep pagination, 50 pages is safe
            };
        } catch (error) {
            console.error(error);
            return { results: [], total_pages: 1 };
        }
    },

    // Получить новинки и ожидаемые игры
    getWeeklyNewGames: async (limit: number = 8): Promise<SteamGameDetails[]> => {
        try {
            const res = await fetch(`https://store.steampowered.com/api/featuredcategories?l=russian`, {
                next: { revalidate: 3600 * 24 }
            });
            if (!res.ok) throw new Error('Steam featuredcategories failed');
            const data = await res.json();
            
            const newReleases = data.new_releases?.items || [];
            const comingSoon = data.coming_soon?.items || [];
            
            const combined = [...newReleases, ...comingSoon];
            const uniqueIds = Array.from(new Set(combined.map(item => item.id))).slice(0, limit);
            
            const detailsPromises = uniqueIds.map(id => steamApi.getGameDetails(id));
            const detailsResults = await Promise.all(detailsPromises);
            
            return detailsResults.filter((game): game is SteamGameDetails => game !== null && game.type === 'game');
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Получить ожидаемые новинки (Top Wishlisted / Popular Coming Soon)
    getAnticipatedGames: async (limit: number = 10): Promise<SteamGameDetails[]> => {
        try {
            const res = await fetch('https://store.steampowered.com/search/results?q=&category1=998&filter=popularcomingsoon', {
                next: { revalidate: 3600 * 24 }
            });
            if (!res.ok) throw new Error('Steam search fetch failed');
            const text = await res.text();
            
            const ids: string[] = [];
            const regex = /data-ds-appid="(\d+)"/g;
            let match;
            while ((match = regex.exec(text)) !== null) {
                ids.push(match[1]);
            }
            
            const uniqueIds = Array.from(new Set(ids)).slice(0, 20); // fetch extra to account for failures
            
            const detailsPromises = uniqueIds.map(id => steamApi.getGameDetails(id));
            const detailsResults = await Promise.all(detailsPromises);
            
            return detailsResults.filter((game): game is SteamGameDetails => game !== null && game.type === 'game').slice(0, limit);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Получить лучшие новинки конкретного года (по умолчанию 2026)
    getBestGamesOf2026: async (limit: number = 20): Promise<SteamGameDetails[]> => {
        try {
            const fetchSearchPage = async (page: number) => {
                const res = await fetch(`https://store.steampowered.com/search/results?q=&category1=998&filter=popularnew&page=${page}`, {
                    next: { revalidate: 3600 * 24 }
                });
                const text = await res.text();
                const ids: string[] = [];
                const regex = /data-ds-appid="(\d+)"/g;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    ids.push(match[1]);
                }
                return ids;
            };

            // Fetch a few pages to get enough 2026 games
            const [page1, page2, page3, page4] = await Promise.all([
                fetchSearchPage(1),
                fetchSearchPage(2),
                fetchSearchPage(3),
                fetchSearchPage(4)
            ]);
            
            const uniqueIds = Array.from(new Set([...page1, ...page2, ...page3, ...page4]));
            
            const detailsPromises = uniqueIds.map(id => steamApi.getGameDetails(id));
            const detailsResults = await Promise.all(detailsPromises);
            
            const gamesOf2026 = detailsResults.filter((game): game is SteamGameDetails => {
                if (!game || game.type !== 'game') return false;
                const match = game.release_date?.date?.match(/\b(19\d{2}|20\d{2})\b/);
                return match ? match[1] === '2026' : false;
            });
            
            // Sort by positive reviews / recommendations if available (hyper/popular)
            gamesOf2026.sort((a, b) => {
                const recA = a.recommendations?.total || 0;
                const recB = b.recommendations?.total || 0;
                return recB - recA;
            });
            
            return gamesOf2026.slice(0, limit);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Вспомогательная функция для вертикальных 9/16 обложек
    getVerticalImage: (appId: number | string): string => {
        return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`;
    },

    // Вспомогательная функция для больших 16/9 баннеров (высокое качество)
    getHeroImage: (appId: number | string): string => {
        return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_hero.jpg`;
    },

    // Поиск игр
    searchGames: async (query: string) => {
        try {
            const res = await fetch(`https://steamcommunity.com/actions/SearchApps/${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Steam search failed');
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Поиск игр с загрузкой полных деталей
    searchGamesWithDetails: async (query: string, limit: number = 20): Promise<SteamGameDetails[]> => {
        try {
            const searchResults = await steamApi.searchGames(query);
            const gamesToFetch = searchResults.slice(0, limit);
            
            const detailsPromises = gamesToFetch.map((game: any) => steamApi.getGameDetails(game.appid));
            const detailsResults = await Promise.all(detailsPromises);
            
            return detailsResults.filter((game): game is SteamGameDetails => game !== null && game.type === 'game');
        } catch (error) {
            console.error(error);
            return [];
        }
    }
};
