import { CollectionProps } from './CollectionCard';

export const mockCollections: CollectionProps[] = [
    {
        id: '1',
        title: '10 фильмов, финал которых заставит открыть рот',
        description: 'Собрали лучшие триллеры и детективы с невероятными сюжетными поворотами, которые невозможно предугадать.',
        image: 'https://image.tmdb.org/t/p/w780/9cqNxxWXNDO5GIt3Mtl032G5GjG.jpg',
        count: 10,
        type: 'movies',
    },
    {
        id: '2',
        title: 'Лучшие RPG для глубокого погружения',
        description: 'Игры, в которых можно пропасть на сотни часов. Огромные миры, сложный выбор и свобода действий.',
        image: 'https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpy6.jpg',
        count: 15,
        type: 'games',
    },
    {
        id: '3',
        title: 'Аниме, от которого хочется плакать',
        description: 'Запасайтесь платочками. Самые трогательные и драматичные истории в японской анимации.',
        image: 'https://image.tmdb.org/t/p/w780/2uNWLqbgB4OebP2k3Y8AAn9Kj5C.jpg',
        count: 8,
        type: 'anime',
    },
    {
        id: '4',
        title: 'Что посмотреть на Хэллоуин',
        description: 'Жуткие хорроры, слэшеры и мистические триллеры для самой темной ночи в году.',
        image: 'https://image.tmdb.org/t/p/w780/oF9fE9L9N7x32E5E3B3w9v6H0.jpg',
        count: 13,
        type: 'mixed',
    },
    {
        id: '5',
        title: 'Сериалы для запойного просмотра',
        description: 'Захватывающие сериалы, которые невозможно поставить на паузу. Смотрим сезон за одну ночь!',
        image: 'https://image.tmdb.org/t/p/w780/6WBeq4PNCFm2b8QJ7B8n2wA2J5.jpg',
        count: 20,
        type: 'series',
    },
    {
        id: '6',
        title: 'Космос и фантастика',
        description: 'Путешествия к звездам, пришельцы и футуристические миры. Лучший Sci-Fi контент.',
        image: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MvrId.jpg',
        count: 12,
        type: 'movies',
    },
];

export const trendingCollections: CollectionProps[] = [
    {
        id: 'cyberpunk',
        title: 'Неоновые сны: Лучшие игры и фильмы в стиле Киберпанк',
        description: 'Огромные мегаполисы, импланты, хакеры и зловещие корпорации. Самые атмосферные тайтлы.',
        image: 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsmEZzAUdi.jpg',
        count: 14,
        type: 'mixed',
    },
    {
        ...mockCollections[0]
    },
    {
        ...mockCollections[1]
    }
];
