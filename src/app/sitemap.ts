import type { MetadataRoute } from 'next';

import { PROPERTIES } from '@/data/properties';
import { SITE_URL } from '@/lib/site';

/**
 * Static sitemap. Every catalogue entry gets a URL, so add a `Property` to
 * `src/data/properties.ts` and it is discoverable without touching this file.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/properties`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = PROPERTIES.map((property) => ({
    url: `${SITE_URL}/properties/${property.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: property.isFeatured ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
