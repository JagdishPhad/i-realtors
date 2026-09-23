import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFiltersBar } from '@/components/PropertyFiltersBar';
import { PROPERTIES, getMicroLocations } from '@/data/properties';
import { getWhatsAppHref } from '@/lib/contact';
import { filterProperties, parsePropertyFilters, type SearchParamsInput } from '@/lib/filters';

export const metadata: Metadata = {
  title: '2, 3 & 4 BHK Projects in Pune West',
  description:
    'Browse RERA-verified 2, 3 & 4 BHK residential projects across Baner, Balewadi, Tathawade, Hinjewadi and Pune West with I Realtors, a MahaRERA registered consultant based in Baner, Pune.',
  alternates: {
    canonical: '/properties',
  },
};

interface PropertiesPageProps {
  searchParams: SearchParamsInput;
}

/**
 * Catalogue listing.
 *
 * All filter state is derived from the URL and validated server-side, so the page
 * stays a Server Component with no client JavaScript and every filtered view is
 * shareable + indexable.
 */
export default function PropertiesPage({ searchParams }: PropertiesPageProps): JSX.Element {
  const filters = parsePropertyFilters(searchParams);
  const results = filterProperties(PROPERTIES, filters);
  const microLocationCount = getMicroLocations().length;

  return (
    <div className="container-shell space-y-8 py-10 sm:py-14">
      <header className="max-w-3xl space-y-4">
        <p className="section-eyebrow">Projects</p>
        <h1 className="text-display-sm font-bold text-ink">
          RERA-verified homes across <span className="text-gradient-gold">Pune West</span>
        </h1>
        <p className="muted-copy">
          {PROPERTIES.length} handpicked projects across {microLocationCount} micro-markets. Filter by
          market, budget and configuration — then message us for the exact cost sheet and live
          availability.
        </p>
      </header>

      <PropertyFiltersBar filters={filters} resultCount={results.length} />

      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <section className="card-surface space-y-4 p-8 text-center sm:p-12">
          <h2 className="text-lg font-semibold text-ink">
            No projects match that combination right now
          </h2>
          <p className="muted-copy mx-auto max-w-xl">
            Inventory moves weekly. Send us your budget, preferred micro-market and possession
            timeline — we will share matching options from our developer network, including
            pre-launch inventory.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/properties" className="btn-outline">
              Clear all filters
            </Link>
            <a
              href={getWhatsAppHref(
                'Hi I Realtors, please share options matching my budget and preferred location in Pune West.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Send my requirement
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
