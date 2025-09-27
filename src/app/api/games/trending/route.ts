import { NextResponse } from 'next/server';
import { githubDb } from '@/lib/githubDb';

export async function GET() {
  try {
    const trendingGames = await githubDb.getTrendingGames(5);
    return NextResponse.json(trendingGames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending games' }, { status: 500 });
  }
}