import { NextResponse } from 'next/server';
import { githubDb } from '@/lib/githubDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('search');

    const options = {
      search: search || undefined,
      category: category || undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12
    };

    const result = await githubDb.searchGames(options);
    
    let games = result.games;
    
    // فلترة exclude
    if (exclude) {
      games = games.filter(game => game.id !== parseInt(exclude));
    }

    // إذا كان هناك pagination
    if (page && limit) {
      return NextResponse.json({
        games: games,
        totalPages: result.totalPages,
        currentPage: parseInt(page),
        totalCount: result.totalCount
      });
    }

    // بدون pagination
    return NextResponse.json(games);
  } catch (error) {
    console.error('GitHub DB error:', error);
    return NextResponse.json({ 
      games: [], 
      totalPages: 0, 
      currentPage: 1, 
      totalCount: 0,
      error: 'Failed to fetch games: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, downloadLink, category, platforms, systemReqs, gameSpecs } = body;

    if (!title || !description || !imageUrl || !downloadLink || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newGame = await githubDb.addGame({
      title,
      description,
      imageUrl,
      downloadLink,
      category,
      platforms: platforms || undefined,
      systemReqs: systemReqs || undefined,
      gameSpecs: gameSpecs || undefined
    });

    return NextResponse.json(newGame);
  } catch (error) {
    console.error('GitHub DB error:', error);
    return NextResponse.json({ error: 'Failed to create game: ' + (error as Error).message }, { status: 500 });
  }
}