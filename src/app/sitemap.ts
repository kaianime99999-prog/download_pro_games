import { MetadataRoute } from 'next'
import { githubDb } from '@/lib/githubDb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://download-pro.vercel.app'
  
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // إضافة صفحات الألعاب
  let gameRoutes: MetadataRoute.Sitemap = []
  
  if (process.env.NODE_ENV === 'production') {
    try {
      const result = await githubDb.searchGames({ limit: 1000 })
      
      gameRoutes = result.games.map((game) => ({
        url: `${baseUrl}/game/${game.id}`,
        lastModified: new Date(game.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    } catch (error) {
      console.error('Error generating sitemap:', error)
    }
  }

  return [...staticRoutes, ...gameRoutes]
}