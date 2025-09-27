'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // التحقق من وجود token قبل التوجيه
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        // لا يوجد token، توجيه لصفحة تسجيل الدخول
        window.location.href = '/admin/login';
      } else {
        // يوجد token، توجيه للداش بورد
        window.location.href = '/admin/dashboard';
      }
    };

    // تأخير بسيط للتأكد من تحميل الكوكيز
    setTimeout(checkAuth, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl text-gray-700">🔐 جاري التحقق من الصلاحيات...</div>
      </div>
    </div>
  );
}