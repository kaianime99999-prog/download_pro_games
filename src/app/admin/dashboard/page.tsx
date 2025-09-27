'use client';
import { useState, useEffect } from 'react';

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
  platforms?: string;
  systemReqs?: string;
  gameSpecs?: string;
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'warning' | 'info', message: string} | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{show: boolean, message: string, onConfirm: () => void} | null>(null);
  
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };
  
  const categoryNames: { [key: string]: string } = {
    ACTION: 'ألعاب أكشن',
    WAR: 'ألعاب حرب',
    FOOTBALL: 'ألعاب كرة قدم',
    OPEN_WORLD: 'ألعاب عالم مفتوح',
    CARS: 'ألعاب سيارات',
    LIGHT: 'ألعاب خفيفة',
    HORROR: 'ألعاب رعب',
    STRATEGY: 'ألعاب استراتيجية',
    CLASSIC: 'ألعاب قديمة'
  };
  const [newGame, setNewGame] = useState<Partial<Game>>({
    title: '',
    description: '',
    imageUrl: '',
    downloadLink: '',
    category: 'ACTION',
    platforms: '',
    systemReqs: '',
    gameSpecs: ''
  });

  const fetchGames = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '1000'); // جلب جميع الألعاب للداش بورد
      
      const url = `/api/games${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // تحقق من وجود token عند تحميل الصفحة
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      
      setIsAuthenticated(true);
      fetchGames();
    };

    checkAuth();
    
    // تحقق دوري من صلاحية الجلسة كل 5 ثواني
    const checkSession = setInterval(async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin-token='))
          ?.split('=')[1];
          
        if (!token) {
          clearInterval(checkSession);
          handleLogout();
          return;
        }
        
        const response = await fetch('/api/admin/check-session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          clearInterval(checkSession);
          showNotification('warning', 'انتهت صلاحية الجلسة. سيتم تسجيل الخروج تلقائياً.');
          setTimeout(() => handleLogout(), 2000);
        }
      } catch (error) {
        clearInterval(checkSession);
        handleLogout();
      }
    }, 5000);
    
    return () => clearInterval(checkSession);
  }, [selectedCategory, searchQuery]);

  const handleLogout = () => {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  };

  const handleDelete = (id: number, title: string) => {
    setConfirmDialog({
      show: true,
      message: `هل أنت متأكد من حذف لعبة "${title}"؟`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/games/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${document.cookie.split('admin-token=')[1]?.split(';')[0]}`
            }
          });
          if (response.ok) {
            fetchGames();
            showNotification('success', 'تم حذف اللعبة بنجاح!');
          } else {
            showNotification('error', 'فشل في حذف اللعبة');
          }
        } catch (error) {
          console.error('Error deleting game:', error);
          showNotification('error', 'حدث خطأ أثناء حذف اللعبة');
        }
        setConfirmDialog(null);
      }
    });
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingGame) return;
    
    try {
      const response = await fetch(`/api/games/${editingGame.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('admin-token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify(editingGame)
      });
      
      if (response.ok) {
        fetchGames();
        setShowEditModal(false);
        setEditingGame(null);
        showNotification('success', 'تم تحديث اللعبة بنجاح!');
      } else {
        showNotification('error', 'فشل في تحديث اللعبة');
      }
    } catch (error) {
      console.error('Error updating game:', error);
      showNotification('error', 'حدث خطأ أثناء تحديث اللعبة');
    }
  };

  const handleAddGame = async () => {
    try {
      // تحقق من الأسماء المشابهة أولاً
      const checkResponse = await fetch(`/api/games?search=${encodeURIComponent(newGame.title || '')}`);
      const existingGames = await checkResponse.json();
      
      if (Array.isArray(existingGames) && existingGames.length > 0) {
        const similarGames = existingGames.filter(game => 
          game.title.toLowerCase().includes((newGame.title || '').toLowerCase()) ||
          (newGame.title || '').toLowerCase().includes(game.title.toLowerCase())
        );
        
        if (similarGames.length > 0) {
          showNotification('warning', `تم العثور على ${similarGames.length} لعبة مشابهة. يرجى التحقق قبل المتابعة.`);
          
          setConfirmDialog({
            show: true,
            message: `تم العثور على ${similarGames.length} لعبة مشابهة. هل تريد المتابعة بإضافة اللعبة؟`,
            onConfirm: () => {
              setConfirmDialog(null);
              continueAddGame();
            }
          });
          return;
        }
      }
      
      continueAddGame();
    } catch (error) {
      console.error('Error adding game:', error);
      showNotification('error', 'حدث خطأ أثناء إضافة اللعبة');
    }
  };
  
  const continueAddGame = async () => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('admin-token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify(newGame)
      });
      
      if (response.ok) {
        fetchGames();
        setShowAddModal(false);
        setNewGame({
          title: '',
          description: '',
          imageUrl: '',
          downloadLink: '',
          category: 'ACTION',
          platforms: '',
          systemReqs: '',
          gameSpecs: ''
        });
        showNotification('success', 'تم إضافة اللعبة بنجاح!');
      } else {
        showNotification('error', 'فشل في إضافة اللعبة');
      }
    } catch (error) {
      console.error('Error adding game:', error);
      showNotification('error', 'حدث خطأ أثناء إضافة اللعبة');
    }
  };

  const handleBackup = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];
        
      const response = await fetch('/api/admin/backup', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const backup = await response.json();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('success', 'تم تحميل النسخة الاحتياطية بنجاح!');
      } else {
        showNotification('error', 'فشل في إنشاء النسخة الاحتياطية');
      }
    } catch (error) {
      showNotification('error', 'حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setConfirmDialog({
      show: true,
      message: 'هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم حذف جميع البيانات الحالية!',
      onConfirm: async () => {
        setConfirmDialog(null);
        await processRestore(file);
      }
    });
  };
  
  const processRestore = async (file: File) => {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];
        
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backupData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showNotification('success', result.message);
        fetchGames();
      } else {
        showNotification('error', result.error || 'فشل في استعادة النسخة الاحتياطية');
      }
    } catch (error) {
      showNotification('error', 'ملف غير صالح أو حدث خطأ');
    }

  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4 neon-glow"></div>
          <div className="text-xl text-white">🔐 جاري التحقق من الصلاحيات...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/icon.jpg" alt="Logo" className="w-10 h-10 rounded-xl border-2 border-cyan-500 neon-glow" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              🔧 لوحة تحكم الأدمن
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 rounded-xl hover:from-red-500 hover:to-red-400 cursor-pointer font-semibold transition-all hover:scale-105 neon-glow flex items-center gap-2"
          >
            🚪 خروج
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2">
            📊 إحصائيات الموقع
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-2xl text-center border border-blue-500 neon-glow">
              <div className="text-3xl font-bold text-white mb-2">{games.length}</div>
              <div className="text-blue-100">إجمالي الألعاب</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-6 rounded-2xl text-center border border-green-500 neon-glow">
              <div className="text-3xl font-bold text-white mb-2">✅</div>
              <div className="text-green-100">النظام يعمل</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl text-center border border-purple-500 neon-glow">
              <div className="text-3xl font-bold text-white mb-2">🔐</div>
              <div className="text-purple-100">محمي بالكامل</div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleBackup}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-500 hover:to-red-500 cursor-pointer flex items-center gap-2 font-semibold transition-all hover:scale-105 neon-glow"
            >
              💾 تحميل نسخة احتياطية
            </button>
            <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 cursor-pointer flex items-center gap-2 font-semibold transition-all hover:scale-105 neon-glow">
              📁 استعادة نسخة احتياطية
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 flex items-center gap-2">
              🎮 إدارة الألعاب ({games.length})
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              ➕ إضافة لعبة جديدة
            </button>
          </div>
          
          {/* بحث وفلترة */}
          <div className="mb-6 space-y-4">
            {/* شريط البحث */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="🔍 بحث عن لعبة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 search-glow transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 rounded-xl hover:from-red-500 hover:to-red-400 cursor-pointer transition-all hover:scale-105"
                >
                  ✖️
                </button>
              )}
            </div>
            
            {/* أزرار الفئات */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-xl text-sm cursor-pointer font-semibold transition-all hover:scale-105 ${
                  selectedCategory === '' 
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white neon-glow' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                }`}
              >
                🎮 جميع الألعاب
              </button>
              {Object.entries(categoryNames).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-xl text-sm cursor-pointer font-semibold transition-all hover:scale-105 ${
                    selectedCategory === key 
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white neon-glow' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4 neon-glow"></div>
              <div className="text-white">🎮 جاري التحميل...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* جدول للموبايل والتابلت */}
              <table className="w-full min-w-[350px] block md:hidden">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-right py-3 w-10 text-xs text-cyan-400 font-bold">ID</th>
                    <th className="text-right py-3 text-xs text-cyan-400 font-bold">اسم اللعبة</th>
                    <th className="text-right py-3 w-16 text-xs text-cyan-400 font-bold">فئة</th>
                    <th className="text-right py-3 w-16 text-xs text-cyan-400 font-bold">عمل</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                      <td className="py-3 text-xs text-gray-300">{game.id}</td>
                      <td className="py-2">
                        <div className="break-words text-xs leading-tight">
                          {game.title.length > 25 ? `${game.title.substring(0, 25)}...` : game.title}
                        </div>
                      </td>
                      <td className="py-2 text-xs">
                        {game.category === 'ACTION' ? 'أكشن' :
                         game.category === 'WAR' ? 'حرب' :
                         game.category === 'FOOTBALL' ? 'كرة' :
                         game.category === 'CARS' ? 'سيارات' :
                         game.category === 'LIGHT' ? 'خفيف' :
                         game.category === 'HORROR' ? 'رعب' : 'أخرى'}
                      </td>
                      <td className="py-2">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => handleEdit(game)}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 py-1 rounded-lg text-xs hover:from-blue-500 hover:to-blue-400 cursor-pointer transition-all hover:scale-105"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(game.id, game.title)}
                            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-1 rounded-lg text-xs hover:from-red-500 hover:to-red-400 cursor-pointer transition-all hover:scale-105"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* جدول لللاب والكمبيوتر */}
              <table className="w-full min-w-[600px] hidden md:table">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-right py-4 w-16 text-cyan-400 font-bold">ID</th>
                    <th className="text-right py-4 text-cyan-400 font-bold">اسم اللعبة</th>
                    <th className="text-right py-4 w-32 text-cyan-400 font-bold">الفئة</th>
                    <th className="text-right py-4 w-32 text-cyan-400 font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                      <td className="py-4 text-sm text-gray-300">{game.id}</td>
                      <td className="py-4">
                        <div className="break-words text-sm leading-tight text-white">
                          {game.title}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-300">{categoryNames[game.category] || game.category}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(game)}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:from-blue-500 hover:to-blue-400 cursor-pointer transition-all hover:scale-105 font-semibold"
                          >
                            ✏️ تعديل
                          </button>
                          <button 
                            onClick={() => handleDelete(game.id, game.title)}
                            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-xl text-sm hover:from-red-500 hover:to-red-400 cursor-pointer transition-all hover:scale-105 font-semibold"
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal التعديل */}
      {showEditModal && editingGame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-600 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2">
              ✏️ تعديل اللعبة: {editingGame.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">اسم اللعبة</label>
                <input
                  type="text"
                  value={editingGame.title}
                  onChange={(e) => setEditingGame({...editingGame, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">الوصف</label>
                <textarea
                  value={editingGame.description}
                  onChange={(e) => setEditingGame({...editingGame, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">رابط الصورة</label>
                <input
                  type="url"
                  value={editingGame.imageUrl}
                  onChange={(e) => setEditingGame({...editingGame, imageUrl: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">رابط التحميل</label>
                <input
                  type="url"
                  value={editingGame.downloadLink}
                  onChange={(e) => setEditingGame({...editingGame, downloadLink: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">الفئة</label>
                <select
                  value={editingGame.category}
                  onChange={(e) => setEditingGame({...editingGame, category: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="ACTION">ألعاب أكشن</option>
                  <option value="WAR">ألعاب حرب</option>
                  <option value="FOOTBALL">ألعاب كرة قدم</option>
                  <option value="OPEN_WORLD">ألعاب عالم مفتوح</option>
                  <option value="CARS">ألعاب سيارات</option>
                  <option value="LIGHT">ألعاب خفيفة</option>
                  <option value="HORROR">ألعاب رعب</option>
                  <option value="STRATEGY">ألعاب استراتيجية</option>
                  <option value="CLASSIC">ألعاب قديمة</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="btn-primary px-6 py-3"
              >
                ✅ حفظ التغييرات
              </button>
              <button
                onClick={() => {setShowEditModal(false); setEditingGame(null);}}
                className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-xl hover:from-gray-500 hover:to-gray-400 cursor-pointer transition-all hover:scale-105 font-semibold"
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal الإضافة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-600 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 flex items-center gap-2">
              ➕ إضافة لعبة جديدة
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">اسم اللعبة *</label>
                <input
                  type="text"
                  value={newGame.title || ''}
                  onChange={(e) => setNewGame({...newGame, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">الوصف *</label>
                <textarea
                  value={newGame.description || ''}
                  onChange={(e) => setNewGame({...newGame, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">رابط الصورة *</label>
                <input
                  type="url"
                  value={newGame.imageUrl || ''}
                  onChange={(e) => setNewGame({...newGame, imageUrl: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">رابط التحميل *</label>
                <input
                  type="url"
                  value={newGame.downloadLink || ''}
                  onChange={(e) => setNewGame({...newGame, downloadLink: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">الفئة *</label>
                <select
                  value={newGame.category || 'ACTION'}
                  onChange={(e) => setNewGame({...newGame, category: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="ACTION">ألعاب أكشن</option>
                  <option value="WAR">ألعاب حرب</option>
                  <option value="FOOTBALL">ألعاب كرة قدم</option>
                  <option value="OPEN_WORLD">ألعاب عالم مفتوح</option>
                  <option value="CARS">ألعاب سيارات</option>
                  <option value="LIGHT">ألعاب خفيفة</option>
                  <option value="HORROR">ألعاب رعب</option>
                  <option value="STRATEGY">ألعاب استراتيجية</option>
                  <option value="CLASSIC">ألعاب قديمة</option>
                </select>
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">المنصات المدعومة</label>
                <input
                  type="text"
                  value={newGame.platforms || ''}
                  onChange={(e) => setNewGame({...newGame, platforms: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                  placeholder="Windows, Mac, Linux"
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">متطلبات التشغيل</label>
                <textarea
                  value={newGame.systemReqs || ''}
                  onChange={(e) => setNewGame({...newGame, systemReqs: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                  rows={2}
                  placeholder="متطلبات النظام..."
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-2 font-semibold">مواصفات إضافية</label>
                <textarea
                  value={newGame.gameSpecs || ''}
                  onChange={(e) => setNewGame({...newGame, gameSpecs: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                  rows={2}
                  placeholder="معلومات إضافية..."
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddGame}
                className="btn-primary px-6 py-3"
                disabled={!newGame.title || !newGame.description || !newGame.imageUrl || !newGame.downloadLink}
              >
                ➕ إضافة اللعبة
              </button>
              <button
                onClick={() => {setShowAddModal(false); setNewGame({
                  title: '',
                  description: '',
                  imageUrl: '',
                  downloadLink: '',
                  category: 'ACTION',
                  platforms: '',
                  systemReqs: '',
                  gameSpecs: ''
                });}}
                className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-xl hover:from-gray-500 hover:to-gray-400 cursor-pointer transition-all hover:scale-105 font-semibold"
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* نظام الإشعارات */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-6 rounded-2xl shadow-2xl max-w-sm border-2 neon-glow ${
          notification.type === 'success' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-400' :
          notification.type === 'error' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white border-red-400' :
          notification.type === 'warning' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-yellow-400' :
          'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {notification.type === 'success' ? '✅' :
               notification.type === 'error' ? '❌' :
               notification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="flex-1">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-lg hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* نافذة التأكيد */}
      {confirmDialog?.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md mx-4 border border-gray-600 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">⚠️ تأكيد</h3>
            <p className="text-gray-300 mb-8 text-center leading-relaxed">{confirmDialog.message}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmDialog.onConfirm}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl hover:from-red-500 hover:to-red-400 cursor-pointer transition-all hover:scale-105 font-semibold"
              >
                ✅ نعم
              </button>
              <button
                onClick={() => setConfirmDialog(null)}
                className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-xl hover:from-gray-500 hover:to-gray-400 cursor-pointer transition-all hover:scale-105 font-semibold"
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}