import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/** Crawl directives plus the sitemap pointer for Google/Bing. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
