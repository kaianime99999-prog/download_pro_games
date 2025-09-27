const categories = [
  { name: 'ألعاب أكشن', value: 'ACTION', icon: '⚔️' },
  { name: 'ألعاب حرب', value: 'WAR', icon: '💣' },
  { name: 'ألعاب كرة قدم', value: 'FOOTBALL', icon: '⚽' },
  { name: 'ألعاب عالم مفتوح', value: 'OPEN_WORLD', icon: '🌍' },
  { name: 'ألعاب سيارات', value: 'CARS', icon: '🏎️' },
  { name: 'ألعاب خفيفة', value: 'LIGHT', icon: '✨' },
  { name: 'ألعاب رعب', value: 'HORROR', icon: '👻' },
  { name: 'ألعاب استراتيجية', value: 'STRATEGY', icon: '♟️' },
  { name: 'ألعاب قديمة', value: 'CLASSIC', icon: '🕹️' }
];

interface SidebarProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}

export default function Sidebar({ onCategoryChange, selectedCategory }: SidebarProps) {
  return (
    <aside className="hidden lg:block bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 h-fit border border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2">
        📁 أقسام الموقع
      </h3>
      <ul className="space-y-3">
        <li>
          <button
            onClick={() => onCategoryChange('')}
            className={`flex items-center gap-3 w-full text-right py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer group ${
              selectedCategory === '' 
                ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white neon-glow' 
                : 'hover:bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🎮</span>
            <span className="font-medium">جميع الألعاب</span>
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.value}>
            <button
              onClick={() => onCategoryChange(category.value)}
              className={`flex items-center gap-3 w-full text-right py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer group ${
                selectedCategory === category.value 
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white neon-glow' 
                  : 'hover:bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}