import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';

import { getWhatsAppHref } from '@/lib/contact';
import type { AvailabilityStatus, PropertyCardModel } from '@/types/property';

/** Urgency/status chip styling keyed by the listing's availability state. */
const AVAILABILITY_STYLES: Record<AvailabilityStatus, string> = {
  Available: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  'Few Units Left': 'border-gold/50 bg-gold-soft text-gold',
  'Sold Out': 'border-surface-border bg-surface text-ink-muted',
};

interface PropertyCardProps {
  property: PropertyCardModel;
  /**
   * `compact` drops the secondary spec grid — used inside carousels and
   * "similar projects" rails where vertical space is tight.
   */
  variant?: 'default' | 'compact';
}

/**
 * Canonical listing card. Consumes the slim `PropertyCardModel` projection so
 * grids never ship gallery/amenity payloads, and exposes two conversion paths:
 * the details page and a pre-filled WhatsApp enquiry.
 */
export function PropertyCard({ property, variant = 'default' }: PropertyCardProps): JSX.Element {
  const detailsHref = `/properties/${property.slug}`;
  const enquiryMessage = `Hi I Realtors, I am interested in ${property.title} (${property.bhk}, ${property.location}). Please share the latest price and availability.`;

  return (
    <article className="card-surface group flex flex-col overflow-hidden">
      <Link
        href={detailsHref}
        className="relative block aspect-[16/10] w-full overflow-hidden"
        aria-label={`View details for ${property.title}`}
      >
        <Image
          src={property.image}
          alt={`${property.title} — ${property.bhk} in ${property.location}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background-deep/85 px-3 py-1 text-xs font-semibold text-gold backdrop-blur">
          {property.priceFormatted}
        </span>
        {property.availability ? (
          <span
            className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur ${AVAILABILITY_STYLES[property.availability]}`}
          >
            {property.availability}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-snug text-ink">
            <Link href={detailsHref} className="transition-colors hover:text-gold">
              {property.title}
            </Link>
          </h3>
          <p className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            {property.location}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Configuration</dt>
            <dd className="font-medium text-ink">{property.bhk}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Micro-market</dt>
            <dd className="font-medium text-ink">{property.microLocation}</dd>
          </div>
        </dl>

        {variant === 'default' ? (
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {property.propertyType}
          </p>
        ) : null}

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Link href={detailsHref} className="btn-outline flex-1 px-4 py-2.5 text-xs sm:text-sm">
            View details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={getWhatsAppHref(enquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold flex-1 px-4 py-2.5 text-xs sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
