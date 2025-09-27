import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const verification = verifyAdminToken(token);
    
    if (!verification.valid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json({ valid: true, username: verification.username });
  } catch (error) {
    return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
  }
}