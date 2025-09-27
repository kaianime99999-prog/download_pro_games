'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TrendingGames from '@/components/TrendingGames';
import GameCard from '@/components/GameCard';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 12;

  useEffect(() => {
    // قراءة البحث من URL عند تحميل الصفحة
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      handleSearch(searchFromUrl); // بحث مباشر
    } else {
      fetchGames();
    }
  }, []);

  useEffect(() => {
    if (searchQuery || selectedCategory) {
      fetchGames();
    }
  }, [currentPage, selectedCategory, searchQuery]);



  const fetchGames = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: gamesPerPage.toString(),
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      });
      
      const response = await fetch(`/api/games?${params}`);
      const data = await response.json();
      
      setFilteredGames(data.games || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = window.innerWidth < 768 ? 5 : 10; // 5 على الموبايل، 10 على الديسكتوب
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 md:px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer text-white font-semibold transition-all hover:scale-105"
        >
          ⬅ السابق
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 md:px-4 py-3 rounded-xl text-sm cursor-pointer font-semibold transition-all hover:scale-105 ${
              currentPage === page
                ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white neon-glow'
                : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 md:px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer text-white font-semibold transition-all hover:scale-105"
        >
          التالي ➡
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <a href="/" className="inline-block">
            <h1 className="text-6xl font-bold mb-6 neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 hover:scale-105 transition-transform cursor-pointer">
              🎮 تحميل العاب برو
            </h1>
          </a>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            🚀 أفضل موقع لتحميل الألعاب المجانية بروابط مباشرة وسريعة
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <Header 
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          <div className="flex-1 order-2 lg:order-1 min-w-0">
            {filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-gray-400 text-lg">لا توجد ألعاب متاحة حالياً</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </div>
          
          <div className="lg:w-80 order-1 lg:order-2 flex-shrink-0">
            <Sidebar 
              onCategoryChange={handleCategoryChange}
              selectedCategory={selectedCategory}
            />
            <TrendingGames />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}