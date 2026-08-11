import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMore() {
  console.log("Seeding more collections...");

  const tagsData = [
    { name: 'Киберпанк', type: 'tag' },
    { name: 'Для двоих', type: 'tag' },
    { name: 'Космос и фантастика', type: 'tag' },
    { name: 'Что посмотреть на Хэллоуин', type: 'tag' },
    { name: 'Постапокалипсис', type: 'tag' },
    { name: 'Комедии', type: 'tag' },
    { name: 'На один вечер', type: 'mood' },
    { name: 'Для мозга', type: 'mood' },
    { name: 'Смотреть с друзьями', type: 'mood' }
  ];

  const { data: insertedTags, error: tagError } = await supabase
    .from('tags')
    .upsert(tagsData, { onConflict: 'name' })
    .select();

  if (tagError) {
    console.error("Tag error", tagError);
    return;
  }
  
  const allTagsRes = await supabase.from('tags').select();
  const allTags = allTagsRes.data || [];

  const collections = [
    // MOVIES
    {
      slug: 'halloween-horror-movies',
      title: 'Что посмотреть на Хэллоуин: Топ-10 ужастиков',
      cover_image: 'https://image.tmdb.org/t/p/w500/7aPRvrhMpwI2LwV0J9F8v964M7K.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/7aPRvrhMpwI2LwV0J9F8v964M7K.jpg',
      hook_text: 'Самые страшные фильмы, которые заставят вас прятаться под одеялом. Идеальная подборка для Хэллоуина или любой другой темной ночи.',
      category: 'movies',
      read_time: 5,
      is_published: true,
      views: 5321,
      tagNames: ['Что посмотреть на Хэллоуин', 'Пощекотать нервы', 'Смотреть с друзьями'],
      items: [
        {
          order_index: 1, item_type: 'movies', item_id: '493922',
          custom_description: 'Семья Грэм начинает распутывать трагические и пугающие тайны своих предков. Этот фильм не использует дешевые скримеры — он пугает до дрожи своей атмосферой.',
          cached_metadata: { title: 'Реинкарнация', year: '2018', image: 'https://image.tmdb.org/t/p/w500/7aPRvrhMpwI2LwV0J9F8v964M7K.jpg', genres: ['Ужасы', 'Триллер'], duration: '2ч 7м', rating: 7.3 }
        },
        {
          order_index: 2, item_type: 'movies', item_id: '419430',
          custom_description: 'Чернокожий фотограф знакомится с родителями своей белой девушки, но выходные за городом оборачиваются настоящим кошмаром.',
          cached_metadata: { title: 'Прочь', year: '2017', image: 'https://image.tmdb.org/t/p/w500/qXWjR50Gf8wBfXpQ2P3DkS2U7O8.jpg', genres: ['Ужасы', 'Триллер'], duration: '1ч 44м', rating: 7.7 }
        }
      ]
    },
    {
      slug: 'cyberpunk-masterpieces',
      title: 'Киберпанк: Будущее, которое мы заслужили',
      cover_image: 'https://image.tmdb.org/t/p/w500/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg',
      hook_text: 'Неоновые улицы, аугментации, зловещие корпорации и искусственный интеллект. Погружаемся в мир high tech, low life.',
      category: 'movies',
      read_time: 8,
      is_published: true,
      views: 3105,
      tagNames: ['Киберпанк', 'Для мозга', 'Космос и фантастика'],
      items: [
        {
          order_index: 1, item_type: 'movies', item_id: '335984',
          custom_description: 'Умопомрачительно красивое продолжение культового фильма. Офицер Кей находит секрет, способный ввергнуть остатки общества в хаос.',
          cached_metadata: { title: 'Бегущий по лезвию 2049', year: '2017', image: 'https://image.tmdb.org/t/p/w500/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg', genres: ['Фантастика', 'Триллер'], duration: '2ч 44м', rating: 8.0 }
        }
      ]
    },
    {
      slug: 'tears-guaranteed',
      title: 'Фильмы, над которыми вы будете рыдать',
      cover_image: 'https://image.tmdb.org/t/p/w500/1Xdd3g8wV8lI69k660JNTQyW9A9.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/1Xdd3g8wV8lI69k660JNTQyW9A9.jpg',
      hook_text: 'Готовьте платочки. Эти картины пробивают на эмоции даже самых суровых зрителей. Истории о любви, потере и надежде.',
      category: 'movies',
      read_time: 6,
      is_published: true,
      views: 8900,
      tagNames: ['Поплакать', 'На один вечер'],
      items: [
        {
          order_index: 1, item_type: 'movies', item_id: '489',
          custom_description: 'История блестящего математика Джона Нэша, борющегося с шизофренией при поддержке любящей жены.',
          cached_metadata: { title: 'Игры разума', year: '2001', image: 'https://image.tmdb.org/t/p/w500/1Xdd3g8wV8lI69k660JNTQyW9A9.jpg', genres: ['Драма', 'Биография'], duration: '2ч 15м', rating: 8.2 }
        }
      ]
    },
    // SERIES
    {
      slug: 'binge-watch-series',
      title: 'Сериалы, которые смотрятся на одном дыхании',
      cover_image: 'https://image.tmdb.org/t/p/w500/4X7o1ssOEvp4BFLim1AZmPNcYbU.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/4X7o1ssOEvp4BFLim1AZmPNcYbU.jpg',
      hook_text: 'Если вы включите первую серию в пятницу вечером, то очнетесь только в воскресенье. Идеально для запойного просмотра.',
      category: 'series',
      read_time: 4,
      is_published: true,
      views: 12500,
      tagNames: ['На один вечер', 'Смотреть с друзьями'],
      items: [
        {
          order_index: 1, item_type: 'series', item_id: '66732',
          custom_description: 'Ностальгический сай-фай триллер про подростков, противостоящих монстрам из параллельного измерения в антураже 80-х.',
          cached_metadata: { title: 'Очень странные дела', year: '2016', image: 'https://image.tmdb.org/t/p/w500/4X7o1ssOEvp4BFLim1AZmPNcYbU.jpg', genres: ['Фантастика', 'Детектив'], duration: '50м', rating: 8.6 }
        }
      ]
    },
    {
      slug: 'brain-breaking-series',
      title: 'Головоломки: Сериалы, ломающие мозг',
      cover_image: 'https://image.tmdb.org/t/p/w500/lOr9FzSV8BIEw66t428D8L5G9O.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/lOr9FzSV8BIEw66t428D8L5G9O.jpg',
      hook_text: 'Многослойные сюжеты, временные петли и загадки, для разгадки которых вам потребуется блокнот.',
      category: 'series',
      read_time: 9,
      is_published: true,
      views: 4500,
      tagNames: ['Для мозга', 'Детективы'],
      items: [
        {
          order_index: 1, item_type: 'series', item_id: '70523',
          custom_description: 'Немецкий шедевр про путешествия во времени, где прошлое, настоящее и будущее сплетены в невообразимый клубок.',
          cached_metadata: { title: 'Тьма', year: '2017', image: 'https://image.tmdb.org/t/p/w500/lOr9FzSV8BIEw66t428D8L5G9O.jpg', genres: ['Фантастика', 'Триллер'], duration: '1ч', rating: 8.8 }
        }
      ]
    },
    {
      slug: 'sitcoms-for-dinner',
      title: 'Ситкомы под ужин',
      cover_image: 'https://image.tmdb.org/t/p/w500/qtzR62b1Zp8P39nEmsm5mSik3fK.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/qtzR62b1Zp8P39nEmsm5mSik3fK.jpg',
      hook_text: 'Добрые, смешные и легкие сериалы, которые идеально подходят для просмотра за едой или фоном.',
      category: 'series',
      read_time: 3,
      is_published: true,
      views: 21000,
      tagNames: ['Комедии', 'На один вечер'],
      items: [
        {
          order_index: 1, item_type: 'series', item_id: '1900',
          custom_description: 'Будни сотрудников бумажной компании Dunder Mifflin во главе с самым неловким боссом на свете Майклом Скоттом.',
          cached_metadata: { title: 'Офис', year: '2005', image: 'https://image.tmdb.org/t/p/w500/qtzR62b1Zp8P39nEmsm5mSik3fK.jpg', genres: ['Комедия'], duration: '22м', rating: 8.9 }
        }
      ]
    },
    // ANIME
    {
      slug: 'shonen-hype',
      title: 'Хайповые сёнены: Драки, превозмогания, эпик',
      cover_image: 'https://image.tmdb.org/t/p/w500/yDqw3E0m2J4FwG2zFIfqYF204vU.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/yDqw3E0m2J4FwG2zFIfqYF204vU.jpg',
      hook_text: 'Если вам хочется увидеть эпичные сражения и крутую анимацию — эти тайтлы разорвут ваши шаблоны.',
      category: 'anime',
      read_time: 5,
      is_published: true,
      views: 18000,
      tagNames: ['Смотреть с друзьями'],
      items: [
        {
          order_index: 1, item_type: 'anime', item_id: '85937',
          custom_description: 'Магическая битва: стильные бои с демонами-проклятиями и один из самых харизматичных наставников в истории аниме.',
          cached_metadata: { title: 'Магическая битва', year: '2020', image: 'https://image.tmdb.org/t/p/w500/yDqw3E0m2J4FwG2zFIfqYF204vU.jpg', genres: ['Сёнен', 'Экшен'], duration: '24м', rating: 8.6 }
        },
        {
          order_index: 2, item_type: 'anime', item_id: '80986',
          custom_description: 'Убийца демонов. Потрясающая анимация от студии Ufotable сделала этот сериал абсолютным хитом.',
          cached_metadata: { title: 'Клинок, рассекающий демонов', year: '2019', image: 'https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SnDNUHK270D5A.jpg', genres: ['Сёнен', 'Экшен'], duration: '24м', rating: 8.7 }
        }
      ]
    },
    {
      slug: 'sad-anime',
      title: 'Аниме, от которых наворачиваются слезы',
      cover_image: 'https://image.tmdb.org/t/p/w500/a35yXmN8jA1i1Mpsf16y1KofD6P.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/a35yXmN8jA1i1Mpsf16y1KofD6P.jpg',
      hook_text: 'Прекрасная анимация в сочетании с душераздирающими сюжетами. Подготовьте платочки.',
      category: 'anime',
      read_time: 4,
      is_published: true,
      views: 6700,
      tagNames: ['Поплакать', 'На один вечер'],
      items: [
        {
          order_index: 1, item_type: 'anime', item_id: '1576',
          custom_description: 'Трогательная история брата и сестры, пытающихся выжить во время бомбежек в Японии под конец Второй мировой войны.',
          cached_metadata: { title: 'Могила светлячков', year: '1988', image: 'https://image.tmdb.org/t/p/w500/a35yXmN8jA1i1Mpsf16y1KofD6P.jpg', genres: ['Драма', 'Аниме'], duration: '1ч 29м', rating: 8.5 }
        }
      ]
    },
    {
      slug: 'mind-bending-anime',
      title: 'Психологическое аниме: Взрыв мозга',
      cover_image: 'https://image.tmdb.org/t/p/w500/z6w9749uJ3pBpxuK82PqEOf4zI6.jpg',
      banner_image: 'https://image.tmdb.org/t/p/original/z6w9749uJ3pBpxuK82PqEOf4zI6.jpg',
      hook_text: 'Глубокий символизм, депрессия, философия и психология. Не для всех, но если зацепит — то навсегда.',
      category: 'anime',
      read_time: 8,
      is_published: true,
      views: 5400,
      tagNames: ['Для мозга', 'Киберпанк'],
      items: [
        {
          order_index: 1, item_type: 'anime', item_id: '890',
          custom_description: 'Культовый "Евангелион". Под видом меха-боевика скрывается глубокая деконструкция жанра и погружение в психику героев.',
          cached_metadata: { title: 'Евангелион', year: '1995', image: 'https://image.tmdb.org/t/p/w500/z6w9749uJ3pBpxuK82PqEOf4zI6.jpg', genres: ['Меха', 'Драма'], duration: '24м', rating: 8.5 }
        }
      ]
    },
    // GAMES
    {
      slug: 'coop-games',
      title: 'Игры для двоих: Разрушаем дружбу и строим любовь',
      cover_image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg',
      banner_image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1426210/page_bg_generated_v6b.jpg',
      hook_text: 'Лучшие кооперативные игры для совместного прохождения с другом, партнером или ребенком.',
      category: 'games',
      read_time: 4,
      is_published: true,
      views: 15400,
      tagNames: ['Смотреть с друзьями', 'Для двоих'],
      items: [
        {
          order_index: 1, item_type: 'games', item_id: '1426210',
          custom_description: 'Идеальное кооперативное приключение про пару на грани развода, превращенную в кукол. Лучшая игра года 2021.',
          cached_metadata: { title: 'It Takes Two', year: '2021', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg', genres: ['Co-op', 'Platformer'], duration: '10-15ч', rating: 9.6 }
        },
        {
          order_index: 2, item_type: 'games', item_id: '728880',
          custom_description: 'Сварить суп кажется простым занятием, пока кухня не загорится, а ингредиенты не упадут в пропасть.',
          cached_metadata: { title: 'Overcooked! 2', year: '2018', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/728880/header.jpg', genres: ['Co-op', 'Casual'], duration: '8ч', rating: 8.8 }
        }
      ]
    },
    {
      slug: 'post-apocalyptic-games',
      title: 'Выживание после конца света',
      cover_image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/header.jpg',
      banner_image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/page_bg_generated_v6b.jpg',
      hook_text: 'Мутанты, радиация, зомби и постоянная нехватка патронов. Лучшие игры в жанре постапокалипсис.',
      category: 'games',
      read_time: 6,
      is_published: true,
      views: 7800,
      tagNames: ['Постапокалипсис', 'Пощекотать нервы'],
      items: [
        {
          order_index: 1, item_type: 'games', item_id: '1151640',
          custom_description: 'Окунитесь в мрачную и реалистичную атмосферу постапокалиптической Москвы и отправляйтесь в путешествие на бронепоезде.',
          cached_metadata: { title: 'Metro Exodus', year: '2019', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/header.jpg', genres: ['FPS', 'Survival'], duration: '20ч', rating: 8.7 }
        }
      ]
    },
    {
      slug: 'story-rich-games',
      title: 'Сюжетные игры, круче любого фильма',
      cover_image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
      banner_image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/page_bg_generated_v6b.jpg',
      hook_text: 'Если вам важен глубокий сюжет, моральные выборы и отлично прописанные персонажи, то вы обязаны поиграть в это.',
      category: 'games',
      read_time: 7,
      is_published: true,
      views: 11200,
      tagNames: ['Для мозга', 'Топ 10'],
      items: [
        {
          order_index: 1, item_type: 'games', item_id: '1174180',
          custom_description: 'Самая масштабная ковбойская сага в истории видеоигр. Невероятный уровень детализации и история Артура Моргана навсегда останутся в вашем сердце.',
          cached_metadata: { title: 'Red Dead Redemption 2', year: '2019', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg', genres: ['Action', 'Story'], duration: '50-100ч', rating: 9.8 }
        },
        {
          order_index: 2, item_type: 'games', item_id: '1086940',
          custom_description: 'Игра, перевернувшая представление о RPG. Каждое ваше решение имеет последствия в мире Забытых Королевств.',
          cached_metadata: { title: 'Baldur\'s Gate 3', year: '2023', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg', genres: ['RPG', 'Story'], duration: '100ч+', rating: 9.7 }
        }
      ]
    }
  ];

  for (const col of collections) {
    const { tagNames, items, ...collectionData } = col;

    // insert collection
    const { data: newCol, error: colError } = await supabase
      .from('collections')
      .upsert(collectionData, { onConflict: 'slug' })
      .select()
      .single();

    if (colError) {
      console.error("Error inserting", collectionData.slug, colError);
      continue;
    }
    console.log("Inserted:", newCol.title);

    // link tags
    if (tagNames && tagNames.length > 0) {
      const tagIds = tagNames.map(name => allTags.find(t => t.name === name)?.id).filter(Boolean);
      const collectionTags = tagIds.map(tag_id => ({ collection_id: newCol.id, tag_id }));
      await supabase.from('collection_tags').upsert(collectionTags, { onConflict: 'collection_id,tag_id' });
    }

    // add items
    if (items && items.length > 0) {
      await supabase.from('collection_items').delete().eq('collection_id', newCol.id);
      const itemsToInsert = items.map(item => ({ ...item, collection_id: newCol.id }));
      await supabase.from('collection_items').insert(itemsToInsert);
    }
  }

  console.log("Done seeding!");
}

seedMore();
