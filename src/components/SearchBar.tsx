'use client';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout - البحث بعد 300ms من آخر كتابة
    debounceRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="🔍 ابحث عن لعبتك المفضلة..."
          className="w-full px-6 py-3 text-lg rounded-2xl border-2 border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none search-glow transition-all duration-300"
        />
        <button
          type="submit"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 neon-glow"
        >
          🚀 بحث
        </button>
      </div>
    </form>
  );
}