import { NextResponse } from 'next/server';
import { githubDb } from '@/lib/githubDb';

export async function GET() {
  try {
    const allGames = await githubDb.searchGames({ limit: 10000 });
    
    const backup = {
      timestamp: new Date().toISOString(),
      totalGames: allGames.totalCount,
      games: allGames.games
    };
    
    return NextResponse.json(backup);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const backupData = await request.json();
    
    // في هذا النظام المبسط، لا يمكن استعادة البيانات بشكل كامل
    // لأن البيانات محفوظة في الذاكرة/localStorage
    
    return NextResponse.json({ 
      message: 'النسخ الاحتياطي غير مدعوم في هذا النظام المؤقت',
      error: 'Restore not supported in temporary system'
    }, { status: 501 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}