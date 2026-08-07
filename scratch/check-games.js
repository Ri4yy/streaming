const fetch = require('node-fetch');

async function checkGames() {
    const queries = ['MECCHA CHAMELEON', 'Assassin\'s Creed Black Flag'];
    for (const q of queries) {
        console.log(`Searching for: ${q}`);
        const res = await fetch(`https://steamcommunity.com/actions/SearchApps/${encodeURIComponent(q)}`);
        const data = await res.json();
        console.log(data);
    }
}
checkGames();
