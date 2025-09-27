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

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-800 text-white mt-12 border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* معلومات الموقع */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/icon.jpg" alt="Logo" className="w-10 h-10 rounded-xl border-2 border-cyan-500 neon-glow" />
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                تحميل العاب برو
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              🚀 كل ما تحتاجه من ألعاب الكمبيوتر في مكان واحد. 
              اكتشف أحدث الألعاب وحمل مجاناً بأعلى جودة.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center hover:scale-110 transition-transform neon-glow">
                📘
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center hover:scale-110 transition-transform neon-glow">
                📺
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform neon-glow">
                🎵
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center justify-center hover:scale-110 transition-transform neon-glow">
                🎮
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>👨‍💻</span>
              <span>تطوير:</span>
              <a 
                href="https://www.facebook.com/fawy.maly" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-purple-400 hover:to-cyan-400 transition-all cursor-pointer underline flex items-center gap-2 font-semibold"
              >
                <img 
                  src="/icon.jpg" 
                  alt="Fawy Maly" 
                  className="w-6 h-6 rounded-full object-cover border-2 border-cyan-400 neon-glow"
                />
                <span>Fawy Maly</span>
              </a>
            </div>
          </div>

          {/* أقسام الموقع */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              📁 أقسام الموقع
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                  <span>🎮</span>
                  <span>جميع الألعاب</span>
                </a>
              </li>
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.value}>
                  <a 
                    href={`/?category=${cat.value}`} 
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* المزيد من الأقسام */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              🎯 المزيد
            </h3>
            <ul className="space-y-2">
              {categories.slice(6).map((cat) => (
                <li key={cat.value}>
                  <a 
                    href={`/?category=${cat.value}`} 
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </a>
                </li>
              ))}
              <li className="pt-4">
                <div className="text-gray-400 text-sm">
                  <p className="flex items-center gap-2 mb-2">
                    <span>📊</span>
                    <span>إحصائيات الموقع</span>
                  </p>
                  <p className="text-xs">✅ آلاف الألعاب المجانية</p>
                  <p className="text-xs">⚡ تحديث يومي</p>
                  <p className="text-xs">🔒 تحميل آمن</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* خط الفصل */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>© 2024 تحميل العاب برو. جميع الحقوق محفوظة.</p>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <span>💻</span>
                <span>تم التطوير بواسطة</span>
                <a 
                  href="https://www.facebook.com/fawy.maly" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer underline font-medium flex items-center gap-2"
                >
                  <img 
                    src="/icon.jpg" 
                    alt="Fawy Maly" 
                    className="w-5 h-5 rounded-full object-cover border border-blue-400"
                  />
                  <span>Fawy Maly</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}