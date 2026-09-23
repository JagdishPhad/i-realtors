# I Realtors — Website

High-converting, mobile-first marketing site for **I Realtors**, a MahaRERA registered
real estate consultancy (Reg. No. `A52100000092`) based in Baner, Pune.

## Stack

| Concern    | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | Next.js 14.2 (App Router, `src/` layout) |
| Language   | TypeScript 5 (`strict: true`)           |
| Styling    | Tailwind CSS 3.4 + CSS custom properties |
| Icons      | `lucide-react`                          |
| Fonts      | `next/font/google` (Inter, self-hosted)  |

## Commands

```bash
npm run dev        # local dev server (http://localhost:3000)
npm run build      # production build (runs lint + type check)
npm start          # serve the production build
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
```

Optional: `powershell -ExecutionPolicy Bypass -File scripts/generate-placeholder-assets.ps1`
regenerates the brand placeholder imagery in `public/images/**`.

## Folder map

```
src/
  app/
    layout.tsx            Root layout: metadata, viewport, JSON-LD, header, nav, footer, sticky CTA
    page.tsx              Home (hero, featured rail, micro-markets, contact band)
    properties/
      page.tsx            Catalogue listing with URL-driven filters
      [slug]/page.tsx     Project detail (SSG per property, gallery, amenities, JSON-LD)
    not-found.tsx         Branded 404 that routes visitors back into the funnel
    sitemap.ts            Static sitemap (home, catalogue, every project)
    robots.ts             Crawl rules + sitemap pointer
    globals.css           Design tokens + component primitives (.btn-gold, .card-surface, …)
    icon.svg              Favicon (file-based metadata route)
  components/
    PropertyCard.tsx      Canonical listing card (consumes PropertyCardModel)
    PropertyFiltersBar.tsx  Link-based filter chips (server-rendered, no client JS)
    StickyMobileCta.tsx   Mobile call / WhatsApp bar
  data/
    company.ts            COMPANY_INFO, RERA_NUMBER, WORKING_HOURS, RERA_DISCLAIMER, tagline
    properties.ts         PROPERTIES + getFeaturedProperties/getPropertyBySlug/getRelatedProperties/…
  lib/
    contact.ts            getTelHref / getWhatsAppHref / getDirectionsHref
    filters.ts            parsePropertyFilters / filterProperties / buildPropertiesHref
    site.ts               SITE_URL + absoluteUrl()
  types/
    property.ts           Property, PropertyCardModel, PropertyFilters, CompanyInfo, unions
```

### Routes

| Route                      | Rendering          | Notes                                                        |
| -------------------------- | ------------------ | ------------------------------------------------------------ |
| `/`                        | Static             | Root layout metadata (the SEO title lives here)              |
| `/properties`              | Server on demand   | Reads `?microLocation=&propertyType=&minBhk=&minPrice=&maxPrice=&sort=` |
| `/properties/[slug]`       | SSG (4 pages)      | `generateStaticParams` from `PROPERTIES`; `notFound()` for unknown slugs |
| `/sitemap.xml`, `/robots.txt` | Static          | Derived from `PROPERTIES` + `SITE_URL`                       |

**Adding a project** = add one object to `PROPERTIES` in `src/data/properties.ts`. The detail
route, sitemap entry, filters, related-project rails and JSON-LD all follow automatically.

**Filtering** is entirely URL-driven: `parsePropertyFilters` validates every param against the
`as const` option lists in `src/types/property.ts`, so invalid or hand-edited values are dropped
instead of throwing. No client JavaScript is required on the catalogue.

## Design tokens (dark luxury)

| Token                     | Value     | Tailwind utility        |
| ------------------------- | --------- | ----------------------- |
| Deep background           | `#0B132B` | `bg-background`         |
| Deepest background        | `#020617` | `bg-background-deep`    |
| Card / section surface    | `#1E293B` | `bg-surface`            |
| Raised surface            | `#243349` | `bg-surface-raised`     |
| Accent gold               | `#EAB308` | `bg-gold`, `text-gold`  |
| Accent gold (deep / hover)| `#D97706` | `bg-gold-deep`          |
| Primary text              | `#F8FAFC` | `text-ink`              |
| Secondary text            | `#94A3B8` | `text-ink-muted`        |

Tokens are declared once in `tailwind.config.ts` and mirrored as CSS variables in
`globals.css` so raw CSS and third-party widgets can consume the same palette.

## Data-layer contract

* `Property.priceRaw` (number, INR) drives sorting/filters/structured data;
  `Property.priceFormatted` is the exact string rendered on cards.
* `Property.image` must equal `coverImages[0]`; paths resolve under `public/`.
* `Property.microLocation` is a closed union (`Baner | Balewadi | Tathawade | Wakad |
  Punawale | Hinjewadi | Pune`) so filters stay typo-proof.
* `COMPANY_INFO` is the single source of truth for phone, WhatsApp, address, hours and
  Maps link — consumed by the layout, footer, JSON-LD and every CTA helper.

## Before launch (known placeholders)

1. **Phone & WhatsApp** in `src/data/company.ts` are placeholders (`+91 90000 00000` /
   `919000000000`). Replace with the verified business lines.
2. **`Property.reraNo`** currently mirrors the consultancy's agent RERA number
   (`A52100000092`) for every listing. Swap in each *project's* MahaRERA number.
3. Replace `public/images/properties/**` placeholder artwork with approved renders
   (keep the file names).
4. Set `NEXT_PUBLIC_SITE_URL` per environment; it defaults to `https://www.irealtors.in`.
5. Verify pricing/availability against the live inventory sheet (e.g. Godrej Retreat
   Residences and Lodha Sylvan are published here at the values supplied by sales).
6. Not built yet: a dedicated `/contact` route, a lead-capture form with an API route + CRM
   webhook, and per-project floor-plan/brochure downloads.
