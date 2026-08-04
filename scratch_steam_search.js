async function testSteamSearch() {
    const res = await fetch(`https://steamcommunity.com/actions/SearchApps/witcher`);
    const data = await res.json();
    console.log(data);
}
testSteamSearch();
