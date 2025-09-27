import { NextResponse } from 'next/server';
import { githubDb } from '@/lib/githubDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    
    const result = await githubDb.searchGames({
      search: query,
      category: category || undefined,
      limit: 50
    });
    
    return NextResponse.json({
      games: result.games,
      totalCount: result.totalCount
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      games: [], 
      totalCount: 0,
      error: 'Failed to search games' 
    }, { status: 500 });
  }
}