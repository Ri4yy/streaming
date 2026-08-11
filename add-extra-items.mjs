import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const extraData = [
  {
    slug: 'halloween-horror-movies',
    type: 'movies',
    items: [
      { id: '493922', name: "Реинкарнация", desc: "Семейная драма, перетекающая в самый жуткий кошмар в вашей жизни. Фильм, который не забудешь." },
      { id: '419430', name: "Прочь", desc: "Социальный триллер с идеальным сценарием и нарастающим чувством тревоги." },
      { id: '530385', name: "Солнцестояние", desc: "Хоррор при свете дня. Пугающий и гипнотический скандинавский кошмар." },
      { id: '377', name: "Кошмар на улице Вязов", desc: "Классика, породившая одного из самых известных маньяков в истории кино." }
    ]
  },
  {
    slug: 'cyberpunk-masterpieces',
    type: 'movies',
    items: [
      { id: '335984', name: "Бегущий по лезвию 2049", desc: "Визуальный шедевр Дени Вильнёва. Идеальное продолжение культовой классики." },
      { id: '603', name: "Матрица", desc: "Фильм, который перевернул представление о киберпанке и спецэффектах навсегда." },
      { id: '9323', name: "Призрак в доспехах", desc: "Культовое полнометражное аниме, вдохновившее создателей Матрицы." }
    ]
  },
  {
    slug: 'tears-guaranteed',
    type: 'movies',
    items: [
      { id: '497', name: "Зеленая миля", desc: "Стивен Кинг и Фрэнк Дарабонт подарили нам одну из самых трогательных историй в кино." },
      { id: '13', name: "Форрест Гамп", desc: "История необычного человека с большим сердцем, которая заставляет плакать и смеяться." },
      { id: '597', name: "Титаник", desc: "Эпическая история любви на фоне величайшей катастрофы 20 века." }
    ]
  },
  {
    slug: 'binge-watch-series',
    type: 'series',
    items: [
      { id: '1396', name: "Во все тяжкие", desc: "Трансформация учителя химии в наркобарона. Оторваться невозможно." },
      { id: '66732', name: "Очень странные дела", desc: "Ностальгия по 80-м, подростки, мистика и очень затягивающий сюжет." },
      { id: '87108', name: "Чернобыль", desc: "Пугающе реалистичная и драматичная реконструкция одной из главных трагедий человечества." }
    ]
  },
  {
    slug: 'brain-breaking-series',
    type: 'series',
    items: [
      { id: '70523', name: "Тьма", desc: "Немецкий сериал про путешествия во времени, где всё связано. Мозг сломается точно." },
      { id: '42009', name: "Черное зеркало", desc: "Технологии будущего, показывающие худшие человеческие пороки. Каждая серия как отдельный фильм." },
      { id: '63247', name: "Мир Дикого Запада", desc: "Парк развлечений с андроидами. Философия, загадки и постоянные сюжетные твисты." }
    ]
  },
  {
    slug: 'sitcoms-for-dinner',
    type: 'series',
    items: [
      { id: '1668', name: "Друзья", desc: "Культовый ситком о жизни шестерых друзей в Нью-Йорке. Идеально под любой ужин." },
      { id: '2316', name: "Офис", desc: "Псевдодокументальный сериал о жизни офиса. Неловкий юмор, который обожают миллионы." },
      { id: '4556', name: "Клиника", desc: "Будни молодых врачей. Смешно до слез и порой невероятно грустно." }
    ]
  },
  {
    slug: 'shonen-hype',
    type: 'anime', 
    items: [
      { id: '95479', name: "Магическая битва", desc: "Шикарная анимация боев от MAPPA. Настоящий хит." },
      { id: '85937', name: "Клинок, рассекающий демонов", desc: "Безумно красивые сражения и трогательные моменты." },
      { id: '114410', name: "Человек-бензопила", desc: "Абсолютное безумие, много крови и харизматичные герои." }
    ]
  },
  {
    slug: 'sad-anime',
    type: 'anime',
    items: [
      { id: '75294', name: "Вайолет Эвергарден", desc: "История о поиске смысла слова «люблю». Анимация, от которой захватывает дух." },
      { id: '61663', name: "Твоя апрельская ложь", desc: "Музыка, юность и первая любовь. Готовьте много бумажных платков." },
      { id: '3226', name: "Кланнад", desc: "Второй сезон этого аниме считается эталоном драмы в японской анимации." }
    ]
  },
  {
    slug: 'mind-bending-anime',
    type: 'anime',
    items: [
      { id: '13916', name: "Тетрадь смерти", desc: "Классика психологического триллера и битвы умов." },
      { id: '37765', name: "Врата Штейна", desc: "Путешествия во времени, теория заговора и глубокий психологизм." },
      { id: '10454', name: "Монстр", desc: "Напряженный триллер о нейрохирурге, который спас жизнь будущего серийного убийцы." }
    ]
  },
  {
    slug: 'coop-games',
    type: 'games',
    items: [
      { id: '620', name: "Portal 2", desc: "Головоломки, сарказм GLaDOS и идеальный кооперативный режим." },
      { id: '550', name: "Left 4 Dead 2", desc: "Выживание среди толп зомби. Идеальная игра для веселых вечеров с друзьями." },
      { id: '1222700', name: "A Way Out", desc: "Побег из тюрьмы, который можно совершить только вдвоем. Уникальный опыт." }
    ]
  },
  {
    slug: 'post-apocalyptic-games',
    type: 'games',
    items: [
      { id: '22380', name: "Fallout: New Vegas", desc: "Ролевая игра в радиоактивной пустыне с потрясающими квестами и вариативностью." },
      { id: '1888930', name: "The Last of Us Part I", desc: "Шедевр от Naughty Dog. Глубокая история о выживании и человеческих отношениях." },
      { id: '252490', name: "Rust", desc: "Многопользовательское выживание, где другие игроки опаснее радиации и зверей." } 
    ]
  },
  {
    slug: 'story-rich-games',
    type: 'games',
    items: [
      { id: '292030', name: "The Witcher 3: Wild Hunt", desc: "Ведьмак 3 — игра, где даже самый маленький побочный квест написан как отдельная книга." },
      { id: '632470', name: "Disco Elysium", desc: "Ролевая игра без боевой системы. Только текст, мысли и невероятный сюжет." },
      { id: '1091500', name: "Cyberpunk 2077", desc: "Мрачное будущее, интриги корпораций и захватывающая история Ви и Джонни Сильверхенда." }
    ]
  }
];

async function run() {
    console.log("Starting seeding of extra items with hardcoded IDs...");

    for (const group of extraData) {
        // Find collection
        const { data: collection, error: colError } = await supabase
            .from('collections')
            .select('id')
            .eq('slug', group.slug)
            .single();

        if (colError || !collection) {
            console.error("Could not find collection", group.slug);
            continue;
        }

        // Get current max order
        const { data: currentItems } = await supabase
            .from('collection_items')
            .select('order_index')
            .eq('collection_id', collection.id)
            .order('order_index', { ascending: false })
            .limit(1);

        let orderIndex = (currentItems && currentItems.length > 0) ? currentItems[0].order_index + 1 : 1;

        for (const item of group.items) {
            const metadata = { title: item.name };
            if (group.type === 'games') {
                metadata.image = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`;
            }

            const { error: insertErr } = await supabase.from('collection_items').insert({
                collection_id: collection.id,
                item_id: item.id,
                item_type: group.type,
                order_index: orderIndex,
                custom_description: item.desc,
                cached_metadata: metadata
            });

            if (insertErr) {
                console.error("Failed to insert item", item.name, insertErr);
            } else {
                console.log(`Added ${item.name} to ${group.slug}`);
                orderIndex++;
            }
        }
    }
    
    console.log("Done adding extra items!");
}

run();
