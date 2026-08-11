import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cinebox.local';
  const supabase = await createClient();

  // Define static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/anime`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Fetch collections to include in sitemap
  const { data: collections } = await supabase
    .from('collections')
    .select('slug, category, updated_at, created_at');

  const collectionRoutes: MetadataRoute.Sitemap = collections?.map((col) => ({
    url: `${baseUrl}/collections/${col.category}/${col.slug}`,
    lastModified: new Date(col.updated_at || col.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.9,
  })) || [];

  return [...staticRoutes, ...collectionRoutes];
}
