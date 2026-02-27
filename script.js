const games = [
    {
        "id": "user-game",
        "title": "User Game",
        "description": "A custom game added via iframe.",
        "thumbnail": "https://picsum.photos/seed/usergame/400/300",
        "url": "/blank"
    },
    {
        "id": "sandbox-game",
        "title": "Sandbox Game",
        "description": "A game running in a secure sandbox environment.",
        "thumbnail": "https://picsum.photos/seed/sandbox/400/300",
        "url": "https://n-p362fv5ls2s4s6m33lwz3axlmpr4eykich4bcqi-0lu-script.googleusercontent.com/userCodeAppPanel",
        "sandbox": "allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
    }
];

// DOM Elements
const gamesGrid = document.getElementById('games-grid');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');
const libraryView = document.getElementById('library-view');
const playerView = document.getElementById('player-view');
const searchContainer = document.getElementById('search-container');
const backButton = document.getElementById('back-button');
const logo = document.getElementById('logo');

const playerTitle = document.getElementById('player-title');
const playerDesc = document.getElementById('player-desc');
const gameIframe = document.getElementById('game-iframe');
const externalLink = document.getElementById('external-link');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const closeGameBtn = document.getElementById('close-game-btn');

// Initialize Icons
lucide.createIcons();

// Render Games
function renderGames(filteredGames) {
    gamesGrid.innerHTML = '';
    
    if (filteredGames.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        filteredGames.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card glass rounded-2xl overflow-hidden cursor-pointer group flex flex-col';
            card.innerHTML = `
                <div class="aspect-video relative overflow-hidden">
                    <img
                        src="${game.thumbnail}"
                        alt="${game.title}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerpolicy="no-referrer"
                    />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div class="bg-emerald-500 p-4 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                            <i data-lucide="play" class="w-8 h-8 text-zinc-950 fill-current"></i>
                        </div>
                    </div>
                </div>
                <div class="p-5 flex-1 flex flex-col gap-2">
                    <h3 class="text-xl font-bold group-hover:text-emerald-400 transition-colors">
                        ${game.title}
                    </h3>
                    <p class="text-zinc-400 text-sm line-clamp-2">
                        ${game.description}
                    </p>
                </div>
            `;
            card.onclick = () => openGame(game);
            gamesGrid.appendChild(card);
        });
        lucide.createIcons();
    }
}

// Open Game
function openGame(game) {
    libraryView.classList.add('hidden');
    searchContainer.classList.add('hidden');
    playerView.classList.remove('hidden');
    backButton.classList.remove('hidden');

    playerTitle.textContent = game.title;
    playerDesc.textContent = game.description;
    
    if (game.sandbox) {
        gameIframe.setAttribute('sandbox', game.sandbox);
    } else {
        gameIframe.removeAttribute('sandbox');
    }
    
    gameIframe.src = game.url;
    externalLink.href = game.url;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close Game
function closeGame() {
    libraryView.classList.remove('hidden');
    searchContainer.classList.remove('hidden');
    playerView.classList.add('hidden');
    backButton.classList.add('hidden');
    gameIframe.src = '';
    gameIframe.removeAttribute('sandbox');
}

// Search Logic
searchInput.oninput = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = games.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query)
    );
    renderGames(filtered);
};

// Fullscreen Logic
fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

// Event Listeners
backButton.onclick = closeGame;
closeGameBtn.onclick = closeGame;
logo.onclick = closeGame;

// Initial Render
renderGames(games);
