'use client';
import { useState, useEffect } from 'react';

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  views: number;
}

export default function TrendingGames() {
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchTrendingGames();
  }, []);

  const fetchTrendingGames = async () => {
    try {
      const response = await fetch('/api/games/trending');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTrendingGames(data);
      } else {
        setTrendingGames([]);
      }
    } catch (error) {
      console.error('Error fetching trending games:', error);
      setTrendingGames([]);
    }
  };

  return (
    <div className="trending-border rounded-2xl shadow-2xl p-6 mt-6">
      <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center gap-2">
        🔥 الألعاب الرائجة
      </h3>
      <div className="space-y-4">
        {Array.isArray(trendingGames) && trendingGames.map((game, index) => (
          <a 
            key={game.id}
            href={`/game/${game.id}`}
            className="block p-4 rounded-xl hover:bg-gray-700 transition-all duration-300 group border border-gray-600 hover:border-cyan-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                {index + 1}
              </div>
              <div className="text-xs text-gray-400">👀 {game.views || 0} مشاهدة</div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl mb-3">
              <img 
                src={game.imageUrl} 
                alt={game.title}
                loading="lazy"
                decoding="async"
                className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500 border border-gray-600"
                style={{ contentVisibility: 'auto' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                HOT
              </div>
            </div>
            
            <span className="text-sm font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 block text-center break-words leading-tight transition-all duration-300">
              {game.title}
            </span>
          </a>
        ))}
      </div>
      
      {trendingGames.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎮</div>
          <p className="text-gray-400 text-sm">لا توجد ألعاب رائجة حالياً</p>
        </div>
      )}
    </div>
  );
}