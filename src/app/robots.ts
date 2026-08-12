import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vixio.online';
  
  return {
    rules: {
      userAgent: '*',
      disallow: '/', // Closed from indexing as requested by user
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
