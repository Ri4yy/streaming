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

async function seed() {
  console.log("Seeding collections...");

  // 1. Create Tags
  const tagsData = [
    { name: 'Триллеры', type: 'tag' },
    { name: 'Детективы', type: 'tag' },
    { name: 'Сюжетные повороты', type: 'tag' },
    { name: 'Топ 10', type: 'tag' },
    { name: 'Кино на вечер', type: 'tag' },
    { name: 'Пощекотать нервы', type: 'mood' },
    { name: 'Поплакать', type: 'mood' }
  ];

  const { data: insertedTags, error: tagError } = await supabase
    .from('tags')
    .upsert(tagsData, { onConflict: 'name' })
    .select();

  if (tagError) {
    console.error("Tag error", tagError);
    return;
  }
  console.log("Tags inserted:", insertedTags.length);

  // 2. Create Collection
  const articleData = {
    slug: '10-shocker-movies',
    title: '10 фильмов, финал которых заставит открыть рот',
    cover_image: 'https://image.tmdb.org/t/p/original/9cqNxxWXNDO5GIt3Mtl032G5GjG.jpg',
    hook_text: 'Собрали для вас лучшие триллеры и детективы с невероятными сюжетными поворотами. Эти фильмы мастерски водят зрителя за нос до самых последних минут, а развязка переворачивает все с ног на голову.',
    category: 'movies',
    read_time: 7,
    is_published: true,
    views: 1205
  };

  let collectionId;
  const { data: existingCol } = await supabase.from('collections').select('id').eq('slug', articleData.slug).single();
  
  if (existingCol) {
    collectionId = existingCol.id;
    console.log("Collection already exists:", collectionId);
  } else {
    const { data: newCol, error: colError } = await supabase
      .from('collections')
      .insert(articleData)
      .select()
      .single();
    if (colError) {
      console.error("Collection error", colError);
      return;
    }
    collectionId = newCol.id;
    console.log("Collection inserted:", collectionId);
  }

  // 3. Link tags to collection
  const tagIds = insertedTags.filter(t => ['Триллеры', 'Детективы', 'Сюжетные повороты', 'Топ 10', 'Кино на вечер'].includes(t.name)).map(t => t.id);
  const collectionTags = tagIds.map(tag_id => ({ collection_id: collectionId, tag_id }));
  
  await supabase.from('collection_tags').upsert(collectionTags, { onConflict: 'collection_id,tag_id' });
  console.log("Tags linked to collection");

  // 4. Create Collection Items
  const itemsData = [
    {
      collection_id: collectionId,
      order_index: 1,
      item_type: 'movies',
      item_id: '550',
      custom_description: 'Сотрудник страховой компании страдает бессонницей и пытается вырваться из мучительно скучной жизни. В очередной командировке он встречает Тайлера Дердена — харизматичного торговца мылом с извращенной философией. Культовый фильм Дэвида Финчера, концовка которого стала хрестоматийным примером "вотэтоповорота".',
      cached_metadata: {
        title: 'Бойцовский клуб',
        year: '1999',
        image: 'https://image.tmdb.org/t/p/w1280/rr7E0NoGKxjbkb89eR1GwfoYsmA.jpg',
        genres: ['Драма', 'Триллер'],
        duration: '2ч 19м',
        rating: 8.8
      }
    },
    {
      collection_id: collectionId,
      order_index: 2,
      item_type: 'movies',
      item_id: '11324',
      custom_description: 'Два американских судебных пристава отправляются на один из островов в штате Массачусетс, чтобы расследовать исчезновение пациентки клиники для невменяемых преступников. Мартин Скорсезе и Леонардо ДиКаприо погружают нас в пучину паранойи, где финал заставляет усомниться в собственной вменяемости.',
      cached_metadata: {
        title: 'Остров проклятых',
        year: '2010',
        image: 'https://image.tmdb.org/t/p/w1280/5yvhqE1D5N4kF1yqGz611wV9XjB.jpg',
        genres: ['Триллер', 'Детектив', 'Драма'],
        duration: '2ч 18м',
        rating: 8.5
      }
    },
    {
      collection_id: collectionId,
      order_index: 3,
      item_type: 'movies',
      item_id: '807',
      custom_description: 'Детектив Уильям Сомерсет — ветеран уголовного сыска, мечтающий уйти на пенсию и уехать подальше от города. Но за 7 дней до пенсии на него сваливается молодой напарник и дело о маньяке, который карает за 7 смертных грехов. Концовка, которую вы никогда не забудете ("Что в коробке?!").',
      cached_metadata: {
        title: 'Семь',
        year: '1995',
        image: 'https://image.tmdb.org/t/p/w1280/2uNWLqbgB4OebP2k3Y8AAn9Kj5C.jpg',
        genres: ['Триллер', 'Криминал', 'Детектив'],
        duration: '2ч 7м',
        rating: 8.6
      }
    }
  ];

  // delete old items for this collection first to avoid duplicates
  await supabase.from('collection_items').delete().eq('collection_id', collectionId);

  const { error: itemsError } = await supabase.from('collection_items').insert(itemsData);
  if (itemsError) {
    console.error("Items error", itemsError);
    return;
  }
  console.log("Items inserted successfully!");
}

seed();
