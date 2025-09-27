'use client';
import { useState } from 'react';

const categories = [
  { name: 'ألعاب أكشن', value: 'ACTION', icon: '⚔️', color: 'from-red-500 to-orange-500' },
  { name: 'ألعاب رياضة', value: 'FOOTBALL', icon: '⚽', color: 'from-green-500 to-emerald-500' },
  { name: 'ألعاب مغامرات', value: 'OPEN_WORLD', icon: '🌍', color: 'from-blue-500 to-cyan-500' },
  { name: 'ألعاب رعب', value: 'HORROR', icon: '👻', color: 'from-purple-500 to-pink-500' },
  { name: 'ألعاب خفيفة', value: 'LIGHT', icon: '✨', color: 'from-yellow-500 to-amber-500' },
  { name: 'ألعاب حرب', value: 'WAR', icon: '💣', color: 'from-gray-500 to-slate-500' },
  { name: 'ألعاب استراتيجية', value: 'STRATEGY', icon: '♟️', color: 'from-indigo-500 to-violet-500' },
  { name: 'ألعاب سيارات', value: 'CARS', icon: '🏎️', color: 'from-orange-500 to-red-500' },
  { name: 'ألعاب قديمة', value: 'CLASSIC', icon: '🕹️', color: 'from-teal-500 to-cyan-500' }
];

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
}

export default function Header({ onCategoryChange, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border-b border-gray-800">
      <div className="container mx-auto px-4 py-8">
        
        {/* Gaming Categories Grid */}
        <div className="mt-6">
          <div className="lg:hidden categories-rainbow rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              🎮 فئات الألعاب
            </h2>
          </div>
          <h2 className="hidden lg:block text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            🎮 فئات الألعاب
          </h2>
          
          {/* Desktop Grid */}
          <div className="hidden lg:block">
            <div className="gaming-grid max-w-6xl mx-auto">
              <div 
                onClick={() => onCategoryChange('')}
                className="category-card group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎮</div>
                <div className="text-sm font-semibold text-gray-300 group-hover:text-white">جميع الألعاب</div>
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className="category-card group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <div className="text-sm font-semibold text-gray-300 group-hover:text-white">{cat.name}</div>
                </div>
              ))}
            </div>
          </div>
        
          {/* Mobile Button */}
          <div className="flex justify-center mt-4 lg:hidden">
            <button 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-xl cursor-pointer text-white font-semibold neon-glow"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰ الفئات
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-75 z-40" onClick={() => setMobileMenuOpen(false)}></div>
            <nav className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black z-50 p-6 overflow-y-auto border-l border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">فئات الألعاب</h3>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white text-2xl hover:text-cyan-400 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => { onCategoryChange(''); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-right py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 cursor-pointer text-white font-medium transition-all"
                >
                  <span className="text-2xl">🎮</span>
                  <span>جميع الألعاب</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { onCategoryChange(cat.value); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full text-right py-4 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 cursor-pointer text-white transition-all hover:scale-105"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </>
        )}


      </div>
    </header>
  );
}