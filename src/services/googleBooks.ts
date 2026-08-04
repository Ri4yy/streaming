export const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
export const GOOGLE_BOOKS_API_KEY = 'AIzaSyCGgH4Jp5Dc2Qr6heAdQvaKrM7RL6FZGuM';

export interface GoogleBookVolumeInfo {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
        small?: string;
        medium?: string;
        large?: string;
        extraLarge?: string;
    };
    language?: string;
}

export interface GoogleBook {
    id: string;
    volumeInfo: GoogleBookVolumeInfo;
}

export interface GoogleBooksResponse {
    items?: GoogleBook[];
    totalItems: number;
}

// Fallback Mock Data in case the API is disabled or throws an error.
const MOCK_BOOKS: GoogleBook[] = [
    {
        id: "mock1",
        volumeInfo: {
            title: "Властелин колец. Братство кольца",
            authors: ["Дж. Р. Р. Толкин"],
            publishedDate: "2024",
            description: "Первая часть трилогии «Властелин колец». Эпическое фэнтези о похоходе хоббита Фродо и его спутников к горе Ородруин для уничтожения Единого Кольца. (Переиздание)",
            pageCount: 576,
            categories: ["Фэнтези", "Приключения"],
            averageRating: 4.8,
            ratingsCount: 15200,
            imageLinks: {
                thumbnail: "/img/poster/spider.jpg"
            }
        }
    },
    {
        id: "mock2",
        volumeInfo: {
            title: "Мастер и Маргарита",
            authors: ["Михаил Булгаков"],
            publishedDate: "2023",
            description: "Культовый роман Булгакова, сплетающий мистику, сатиру и философию в истории визита Воланда в Москву 30-х годов. (Юбилейное издание)",
            pageCount: 448,
            categories: ["Классика", "Мистика", "Роман"],
            averageRating: 4.9,
            ratingsCount: 23100,
            imageLinks: {
                thumbnail: "/img/poster/spider.jpg"
            }
        }
    },
    {
        id: "mock3",
        volumeInfo: {
            title: "1984",
            authors: ["Джордж Оруэлл"],
            publishedDate: "2022",
            description: "Классическая антиутопия о тоталитарном государстве Океания, где Старший Брат следит за каждым, а история переписывается каждый день. (Новый перевод)",
            pageCount: 320,
            categories: ["Фантастика", "Антиутопия"],
            averageRating: 4.7,
            ratingsCount: 31000,
            imageLinks: {
                thumbnail: "/img/poster/spider.jpg"
            }
        }
    },
    {
        id: "mock4",
        volumeInfo: {
            title: "Гарри Поттер и философский камень",
            authors: ["Дж. К. Роулинг"],
            publishedDate: "2025",
            description: "Первая книга о приключениях юного волшебника Гарри Поттера в школе чародейства и волшебства Хогвартс. (Иллюстрированное издание)",
            pageCount: 399,
            categories: ["Фэнтези", "Детская литература"],
            averageRating: 4.8,
            ratingsCount: 54000,
            imageLinks: {
                thumbnail: "/img/poster/spider.jpg"
            }
        }
    },
    {
        id: "mock5",
        volumeInfo: {
            title: "Преступление и наказание",
            authors: ["Федор Достоевский"],
            publishedDate: "2021",
            description: "Классический роман, исследующий психологию преступления и вопросы нравственности через историю Родиона Раскольникова. (Подарочное издание)",
            pageCount: 608,
            categories: ["Классика", "Психологический роман"],
            averageRating: 4.6,
            ratingsCount: 12000,
            imageLinks: {
                thumbnail: "/img/poster/spider.jpg"
            }
        }
    }
];

export const googleBooksApi = {
    // Получить популярные книги
    getPopularBooks: async (defaultQuery: string = 'популярные книги', maxResults: number = 80): Promise<GoogleBook[]> => {
        try {
            // Вместо общих запросов используем специфичные для последних лет, чтобы вытягивать именно новинки
            const fetchQuery = async (query: string) => {
                const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&langRestrict=ru&maxResults=40&startIndex=0&key=${GOOGLE_BOOKS_API_KEY}`;
                const res = await fetch(url, { next: { revalidate: 3600 * 24 } });
                if (!res.ok) return [];
                const data: GoogleBooksResponse = await res.json();
                return data.items || [];
            };

            const [page1, page2, page3] = await Promise.all([
                fetchQuery('бестселлер 2025 OR бестселлер 2024'),
                fetchQuery('фантастика 2024 OR фэнтези 2024'),
                fetchQuery('роман 2024 OR детектив 2024')
            ]);

            const allBooks = [...page1, ...page2, ...page3];
            
            if (allBooks.length === 0) {
                throw new Error('Google Books fetch returned no results');
            }
            
            // Убираем дубликаты
            const uniqueBooks = Array.from(new Map(allBooks.map(item => [item.id, item])).values());
            return uniqueBooks.slice(0, maxResults);
        } catch (error) {
            console.error('API Error, falling back to mock data:', error);
            // Если API возвращает ошибку (например, ключ не активирован), отдаем mock-данные
            const expandedMocks = [];
            for (let i = 0; i < 5; i++) {
                expandedMocks.push(...MOCK_BOOKS.map(b => ({ ...b, id: `${b.id}-${i}` })));
            }
            return expandedMocks.slice(0, maxResults);
        }
    },

    // Получить детальную информацию по книге
    getBookDetails: async (volumeId: string): Promise<GoogleBook | null> => {
        try {
            // Сначала проверим, не mock ли это
            if (volumeId.startsWith('mock')) {
                const baseId = volumeId.split('-')[0];
                return MOCK_BOOKS.find(b => b.id === baseId) || null;
            }

            const url = `${GOOGLE_BOOKS_API}/${volumeId}?key=${GOOGLE_BOOKS_API_KEY}`;
            const res = await fetch(url, {
                next: { revalidate: 3600 * 24 }
            });
            
            if (!res.ok) throw new Error(`Google Books Details fetch failed: ${res.status}`);
            
            const data: GoogleBook = await res.json();
            return data;
        } catch (error) {
            console.error('API Error, trying mock fallback:', error);
            return MOCK_BOOKS[0]; // Отдаем какую-нибудь mock книгу, если что-то пошло не так
        }
    },

    getHeroImage: (book: GoogleBook): string => {
        let url = book.volumeInfo.imageLinks?.extraLarge ||
               book.volumeInfo.imageLinks?.large ||
               book.volumeInfo.imageLinks?.medium ||
               book.volumeInfo.imageLinks?.thumbnail ||
               '/img/placeholder-book.jpg';
        return url.replace('&edge=curl', '').replace('&zoom=1', '&zoom=3');
    },

    getThumbnail: (book: GoogleBook): string => {
        let url = book.volumeInfo.imageLinks?.thumbnail ||
               book.volumeInfo.imageLinks?.smallThumbnail ||
               '/img/placeholder-book.jpg';
        // Убираем завиток страницы (edge=curl) и увеличиваем размер (zoom=3)
        return url.replace('&edge=curl', '').replace('&zoom=1', '&zoom=3');
    },

    searchBooks: async (query: string): Promise<GoogleBook[]> => {
        try {
            const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&langRestrict=ru&maxResults=40&key=${GOOGLE_BOOKS_API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) return [];
            const data: GoogleBooksResponse = await res.json();
            return data.items || [];
        } catch (error) {
            console.error('API Error in search:', error);
            return [];
        }
    }
};
