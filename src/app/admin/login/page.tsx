'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 3) {
      setError('تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى بعد 10 دقائق.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.token) {
          document.cookie = `admin-token=${data.token}; path=/; max-age=3600; samesite=strict`;
          console.log('Cookie set, waiting before redirect...');
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 100);
        } else {
          window.location.href = '/admin/dashboard';
        }
      } else {
        setAttempts(prev => prev + 1);
        setError(data.error || 'خطأ في تسجيل الدخول');
        
        if (attempts >= 2) {
          setTimeout(() => {
            setAttempts(0);
          }, 600000);
        }
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم الأدمن</h1>
          <p className="text-gray-600 text-sm mt-2">دخول محمي ومشفر</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              disabled={loading || attempts >= 3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="أدخل اسم المستخدم"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">كلمة المرور</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              disabled={loading || attempts >= 3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="أدخل كلمة المرور"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || attempts >= 3}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التحقق...
              </div>
            ) : (
              'دخول آمن'
            )}
          </button>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>🔒 محمي بتشفير 256-bit</p>
            <p>المحاولات المتبقية: {3 - attempts}</p>
          </div>
        </form>
      </div>
    </div>
  );
}