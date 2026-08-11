const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const validImages = [
    { poster: '/RYMX2wcKCBAr24UyPD7xwmja8y.jpg', backdrop: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg' }, // Avengers
    { poster: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', backdrop: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg' }, // Inception
    { poster: '/gEU2QniE6E77NI6lCU6MvlId7St.jpg', backdrop: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg' }, // Interstellar
    { poster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', backdrop: '/hZkgoQYus5veszTmIVvnALHEbnU.jpg' }, // Fight Club
    { poster: '/f89U3ADr1oiB1s9Gvw81PRq6K4.jpg', backdrop: '/l42JtFq7wNudQ5g4x6y83T4346I.jpg' }, // The Matrix
    { poster: '/39wmItIWsg5sZMyRUHLkBg8lSWe.jpg', backdrop: '/bSXfU4dwZyBA1vMmXvejdRXB2F1.jpg' }, // Spirited Away
    { poster: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', backdrop: '/suopoADq0k8YZr4dQXcU6pToj6s.jpg' }, // Game of Thrones
    { poster: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', backdrop: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg' }, // Breaking Bad
    { poster: '/nJUHX3XL1jMkk8honUZnUmudFb9.jpg', backdrop: '/qobCCQOeeNDwH3B21O6Z77nK4V0.jpg' }, // The Boys
    { poster: '/30W2Rj9CgMTR6eL8L3iHw97u42n.jpg', backdrop: '/yRjEqXvjVqU4gCq8J2sLqDqjY0s.jpg' }, // Cyberpunk Edgerunners
    { poster: '/vauCEnR7CiyVDyaLSWrVsHcRZpn.jpg', backdrop: '/eI2DUSWzO3x8mHryV25FwFm0k20.jpg' }, // Naruto
];

async function updateCollections() {
    const { data: collections, error } = await supabase.from('collections').select('id, title, category');
    
    if (error) {
        console.error("Error fetching collections", error);
        return;
    }

    let i = 0;
    for (const collection of collections) {
        if (collection.category === 'games') {
            continue; // games have valid steamstatic links
        }

        const imgPair = validImages[i % validImages.length];
        const banner = `https://image.tmdb.org/t/p/original${imgPair.backdrop}`;
        const cover = `https://image.tmdb.org/t/p/w500${imgPair.poster}`;

        const { error: updateError } = await supabase
            .from('collections')
            .update({ banner_image: banner, cover_image: cover })
            .eq('id', collection.id);
        
        if (updateError) {
            console.error(`Error updating ${collection.title}`, updateError);
        } else {
            console.log(`Updated ${collection.title} with new images`);
        }
        i++;
    }
}

updateCollections().catch(console.error);
