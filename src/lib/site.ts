/**
 * Canonical site origin used by metadata, `sitemap.ts` and `robots.ts`.
 *
 * Override per environment (preview/staging/production) with
 * `NEXT_PUBLIC_SITE_URL`; the production domain is the safe default so a
 * misconfigured deploy never emits relative canonical URLs.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.irealtors.in';

/** Absolute URL helper for Open Graph images, JSON-LD and sitemap entries. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString();
}
