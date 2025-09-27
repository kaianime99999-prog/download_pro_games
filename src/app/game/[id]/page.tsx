import GameClient from './GameClient';

// توليد metadata ديناميكي لكل لعبة
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/games/${resolvedParams.id}`, {
      cache: 'no-store'
    });
    const game = await response.json();
    
    if (game.error) {
      return {
        title: 'اللعبة غير موجودة - تحميل العاب برو'
      };
    }
    
    const categoryNames: { [key: string]: string } = {
      ACTION: 'ألعاب أكشن',
      WAR: 'ألعاب حرب',
      FOOTBALL: 'ألعاب كرة قدم',
      OPEN_WORLD: 'ألعاب عالم مفتوح',
      CARS: 'ألعاب سيارات',
      LIGHT: 'ألعاب خفيفة',
      HORROR: 'ألعاب رعب',
      STRATEGY: 'ألعاب استراتيجية',
      CLASSIC: 'ألعاب قديمة'
    };
    
    const categoryName = categoryNames[game.category] || 'ألعاب';
    
    return {
      title: `تحميل ${game.title} - ${categoryName}`,
      description: `حمل لعبة ${game.title} مجاناً. ${game.description.substring(0, 150)}...`,
      keywords: `تحميل ${game.title}, ${game.title} مجاني, ${categoryName}, تحميل العاب`,
      authors: [{ name: 'تحميل العاب برو' }],
      robots: 'index, follow',
      openGraph: {
        type: 'article',
        locale: 'ar_SA',
        url: `http://localhost:3000/game/${resolvedParams.id}`,
        siteName: 'تحميل العاب برو',
        title: `تحميل ${game.title} - ${categoryName}`,
        description: `حمل لعبة ${game.title} مجاناً. ${game.description.substring(0, 150)}`,
        images: [{
          url: game.imageUrl,
          width: 1200,
          height: 630,
          alt: game.title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `تحميل ${game.title}`,
        description: `حمل لعبة ${game.title} مجاناً`,
        images: [game.imageUrl]
      },
      alternates: {
        canonical: `http://localhost:3000/game/${resolvedParams.id}`
      }
    };
  } catch (error) {
    return {
      title: 'خطأ - تحميل العاب برو'
    };
  }
}

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  return <GameClient params={params} />;
}