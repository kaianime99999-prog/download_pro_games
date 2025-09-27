interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const handleClick = () => {
    fetch(`/api/games/${game.id}/views`, { method: 'POST' }).catch(() => {});
  };

  return (
    <div className="card flex flex-col md:flex-row gap-6 p-6 group max-w-4xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="md:w-64 w-full overflow-hidden rounded-xl relative z-10">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          loading="lazy"
          decoding="async"
          className="w-full h-48 md:h-40 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 border border-gray-700"
          style={{ contentVisibility: 'auto' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="flex-1 min-w-0 relative z-10">
        <a href={`/game/${game.id}`} onClick={handleClick} className="text-2xl font-bold mb-4 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-400 block break-words transition-all duration-300">
          {game.title}
        </a>
        <p className="text-gray-300 mb-6 text-base leading-relaxed break-words">{game.description}</p>
        <div className="flex gap-3">
          <a 
            href={`/game/${game.id}`}
            onClick={handleClick}
            className="btn-primary inline-flex items-center gap-2 text-lg px-6 py-3"
          >
            🎮 عرض التفاصيل
          </a>
          <button className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 hover:scale-105">
            ⭐ مفضلة
          </button>
        </div>
      </div>
    </div>
  );
}