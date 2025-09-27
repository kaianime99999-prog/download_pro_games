import { NextResponse } from 'next/server';
import { generateAdminToken } from '@/lib/auth';

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    // حماية من البروت فورس
    const attemptKey = `${clientIP}-${username}`;
    const now = Date.now();
    const attempt = loginAttempts.get(attemptKey);
    
    if (attempt && attempt.count >= 3 && now - attempt.lastAttempt < 600000) {
      return NextResponse.json({ 
        error: 'تم حظر الوصول مؤقتاً. حاول مرة أخرى بعد 10 دقائق.' 
      }, { status: 429 });
    }
    
    // تحقق من بيانات الاعتماد
    if (username === 'fawy_admin_2024' && password === 'FawyMaly@2024!') {
      loginAttempts.delete(attemptKey);
      
      const token = generateAdminToken(username);
      
      const response = NextResponse.json({ 
        success: true, 
        token,
        message: 'تم تسجيل الدخول بنجاح' 
      });
      
      response.cookies.set('admin-token', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600,
        path: '/'
      });
      
      return response;
    } else {
      const currentAttempt = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      loginAttempts.set(attemptKey, {
        count: currentAttempt.count + 1,
        lastAttempt: now
      });
      
      return NextResponse.json({ 
        error: 'بيانات دخول غير صحيحة' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'حدث خطأ في الخادم' 
    }, { status: 500 });
  }
}