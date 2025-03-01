const games = [
    {
        name: "Assassin X!",
        releaseYear: 2025,
        universeId: 514392806,
        thumbnailId: 1,
    },
    {
        name: "Rushed Out!",
        releaseYear: 2024,
        universeId: 6176725554,
        thumbnailId: 2,
    },
    {
        name: "RIOTFALL",
        releaseYear: 2023,
        universeId: 3021395192,
        thumbnailId: 0,
    },
    {
        name: "RF Legacy",
        releaseYear: 2021,
        universeId: 1954906532,
        thumbnailId: 0,
    },
    {
        name: "High School",
        releaseYear: 2019,
        universeId: 1056959069,
        thumbnailId: 0,
    },
    {
        name: "Fishing Empire",
        releaseYear: 2018,
        universeId: 546433816,
        thumbnailId: 1,
    },
    {
        name: "Catalog Clicker",
        releaseYear: 2017,
        universeId: 346172393,
        thumbnailId: 0,
    }
]

const gameGrid = document.getElementById("gameGrid");

async function fetchThumbnailsAndPlayers() {
    const universeIds = games.map(game => game.universeId).join(",");

    const thumbnailApiUrl = `https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&countPerUniverse=3&defaults=true&size=256x144&format=Webp&isCircular=false`;
    const playerCountApiUrl = `https://games.roproxy.com/v1/games?universeIds=${universeIds}`;

    try {
        const [thumbnailResponse, playerCountResponse] = await Promise.all([
            fetch(thumbnailApiUrl),
            fetch(playerCountApiUrl)
        ]);

        const thumbnailData = await thumbnailResponse.json();
        const placeRawData = await playerCountResponse.json();

        if (thumbnailData.data && placeRawData.data) {
            games.forEach((game, index) => {
                // Find thumbnail for each game
                const thumbnail = thumbnailData.data.find(t => t.universeId === game.universeId);
                const thumbnailUrl = thumbnail ? thumbnail.thumbnails[game.thumbnailId].imageUrl : "https://placehold.co/384x216";

                const placeData = placeRawData.data.find(p => p.id === game.universeId);
                const playing = placeData ? placeData.playing : 0;
                const visits = placeData ? placeData.visits : 0;
                const placeId = placeData ? placeData.rootPlaceId : 0;

                // Create game card
                const gameCard = document.createElement("div");
                gameCard.classList.add("gameCard");

                gameCard.innerHTML = `
                    <a href="https://www.roblox.com/games/${placeId}/loading" target="_blank">
                        <img src="${thumbnailUrl}" alt="${game.name}">
                        <h3>${game.name}</h3>
                        <h3>${game.releaseYear}</h3>
                        <p class='no-margin'>Playing: ${playing}</p>
                        <p class='no-margin'>Visits: ${numeral(visits).format('0.0a')}</p>
                    </a>
                `;

                gameGrid.appendChild(gameCard);
            });
        }
    } catch (error) {
        console.error("Error fetching thumbnails and player count:", error);
    }
}

fetchThumbnailsAndPlayers();
