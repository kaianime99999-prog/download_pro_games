import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Seed functionality removed - using GitHub Database now
    return NextResponse.json({ 
      message: 'Seed functionality not available with GitHub Database',
      info: 'Games are now stored in GitHub repository'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Seed not available' }, { status: 501 });
  }
}