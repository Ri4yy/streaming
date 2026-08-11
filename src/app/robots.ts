import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/', // Closed from indexing as requested by user
    },
    sitemap: 'https://cinebox.local/sitemap.xml',
  };
}
