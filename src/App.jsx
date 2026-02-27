import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, ArrowLeft, Maximize2, Play, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setSelectedGame(null)}
          >
            <div className="bg-emerald-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              UNBLOCKED<span className="text-emerald-500">GAMES</span>
            </h1>
          </div>

          {!selectedGame && (
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          )}

          {selectedGame && (
            <button
              onClick={() => setSelectedGame(null)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold">Game Library</h2>
                <p className="text-zinc-500">Choose a game and start playing instantly.</p>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layoutId={game.id}
                      className="game-card glass rounded-2xl overflow-hidden cursor-pointer group flex flex-col"
                      onClick={() => setSelectedGame(game)}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-emerald-500 p-4 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                            <Play className="w-8 h-8 text-zinc-950 fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col gap-2">
                        <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-zinc-400 text-sm line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 glass rounded-3xl">
                  <p className="text-zinc-500 text-lg">No games found matching your search.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6 h-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-3xl font-bold text-emerald-400">{selectedGame.title}</h2>
                  <p className="text-zinc-400">{selectedGame.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 glass rounded-xl hover:bg-zinc-800 transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a
                    href={selectedGame.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass rounded-xl hover:bg-zinc-800 transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="relative w-full aspect-video glass rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; keyboard"
                  title={selectedGame.title}
                />
              </div>

              <div className="glass p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full">
                    <Gamepad2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Controls</p>
                    <p className="text-sm text-zinc-500">Use your keyboard and mouse to play.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors font-medium"
                >
                  Close Game
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-white/5 text-center text-zinc-600 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Unblocked Games Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
