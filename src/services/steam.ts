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
    getGamesWithDetails: async (limit: number = 20): Promise<SteamGameDetails[]> => {
        try {
            const popularGames = await steamApi.getPopularGames();
            // Фильтруем старые игры: берем только те, у которых высокий appid (относительно новые игры)
            const newPopularGames = popularGames.filter(game => game.appid > 1500000);
            
            // Если новых популярных мало, дополняем обычными
            const gamesToFetch = newPopularGames.length >= limit 
                ? newPopularGames.slice(0, limit) 
                : [...newPopularGames, ...popularGames.filter(game => game.appid <= 1500000)].slice(0, limit);
            
            // Запрашиваем детали параллельно
            const detailsPromises = gamesToFetch.map(game => steamApi.getGameDetails(game.appid));
            const detailsResults = await Promise.all(detailsPromises);
            
            // Фильтруем null
            return detailsResults.filter((game): game is SteamGameDetails => game !== null && game.type === 'game');
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
    }
};
