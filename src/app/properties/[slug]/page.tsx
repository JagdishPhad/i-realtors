import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';

import { PropertyCard } from '@/components/PropertyCard';
import {
  COMPANY_INFO,
  OFFICE_ADDRESS,
  RERA_DISCLAIMER,
  RERA_REGISTRATION_LABEL,
  WORKING_HOURS,
} from '@/data/company';
import { PROPERTIES, getPropertyBySlug, getRelatedProperties } from '@/data/properties';
import { getDirectionsHref, getTelHref, getWhatsAppHref } from '@/lib/contact';
import { extractBhkCounts } from '@/lib/filters';
import { SITE_URL, absoluteUrl } from '@/lib/site';
import type { Property } from '@/types/property';

interface PropertyDetailPageProps {
  params: { slug: string };
}

/**
 * Pre-render one static page per catalogue entry. Adding a `Property` to
 * `src/data/properties.ts` automatically adds its detail route.
 */
export function generateStaticParams(): Array<{ slug: string }> {
  return PROPERTIES.map((property) => ({ slug: property.slug }));
}

export function generateMetadata({ params }: PropertyDetailPageProps): Metadata {
  const property = getPropertyBySlug(params.slug);

  if (!property) {
    return {
      title: 'Project not found',
      robots: { index: false, follow: true },
    };
  }

  const title = `${property.title} — ${property.bhk} in ${property.location}`;
  const description = `${property.title} by ${property.developerName}, ${property.location}. ${property.bhk} homes from ${property.priceFormatted}. ${RERA_REGISTRATION_LABEL}. Get the latest cost sheet and availability from I Realtors, Baner.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: absoluteUrl(`/properties/${property.slug}`),
      images: [
        {
          url: property.image,
          width: 1600,
          height: 1000,
          alt: `${property.title} — ${property.bhk} in ${property.location}`,
        },
      ],
    },
  };
}

/**
 * `Residence` + `Offer` + `BreadcrumbList` for the listing. Prices/dates come
 * straight from the data layer, so structured data cannot drift from the page.
 */
function buildPropertySchema(property: Property): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Residence',
        name: property.title,
        description: `${property.bhk} ${property.propertyType.toLowerCase()} project by ${property.developerName} in ${property.location}.`,
        url: absoluteUrl(`/properties/${property.slug}`),
        image: property.coverImages.map((image) => absoluteUrl(image)),
        numberOfRooms: Math.max(...extractBhkCounts(property.bhk), 0),
        address: {
          '@type': 'PostalAddress',
          addressLocality: `${property.microLocation}, Pune`,
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        amenityFeature: property.amenities.map((amenity) => ({
          '@type': 'LocationFeatureSpecification',
          name: amenity,
          value: true,
        })),
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Configuration', value: property.bhk },
          { '@type': 'PropertyValue', name: 'Developer', value: property.developerName },
          { '@type': 'PropertyValue', name: 'MahaRERA registration', value: property.reraNo },
        ],
        offers: {
          '@type': 'Offer',
          price: property.priceRaw,
          priceCurrency: 'INR',
          availability:
            property.availability === 'Sold Out'
              ? 'https://schema.org/SoldOut'
              : 'https://schema.org/InStock',
          seller: {
            '@type': 'RealEstateAgent',
            name: COMPANY_INFO.name,
            telephone: COMPANY_INFO.phone,
            identifier: RERA_REGISTRATION_LABEL,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: absoluteUrl('/properties') },
          {
            '@type': 'ListItem',
            position: 3,
            name: property.title,
            item: absoluteUrl(`/properties/${property.slug}`),
          },
        ],
      },
    ],
  };
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps): JSX.Element {
  const property = getPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  const relatedProperties = getRelatedProperties(property.slug);
  const heroImage = property.coverImages[0] ?? property.image;
  const galleryImages = property.coverImages.slice(1);
  const enquiryMessage = `Hi I Realtors, I am interested in ${property.title} (${property.bhk}, ${property.location}). Please share the price breakup, floor plans and availability.`;

  return (
    <article>
      <nav aria-label="Breadcrumb" className="container-shell pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <li>
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/properties" className="transition-colors hover:text-gold">
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-ink">{property.title}</li>
        </ol>
      </nav>

      <div className="container-shell grid gap-8 pb-8 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-surface-border">
            <Image
              src={heroImage}
              alt={`${property.title} — ${property.bhk} in ${property.location}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          {galleryImages.length > 0 ? (
            <ul className="grid grid-cols-3 gap-3">
              {galleryImages.map((image, index) => (
                <li
                  key={image}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-surface-border"
                >
                  <Image
                    src={image}
                    alt={`${property.title} gallery image ${index + 2}`}
                    fill
                    sizes="(max-width: 640px) 30vw, 18vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-6">
          <header className="space-y-3">
            <span className="badge">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {RERA_REGISTRATION_LABEL}
            </span>
            <h1 className="text-display-sm font-bold text-ink">{property.title}</h1>
            <p className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              {property.location}
            </p>
            <p className="text-3xl font-bold text-gold">{property.priceFormatted}</p>
            <p className="text-xs leading-relaxed text-ink-muted">
              Starting price, indicative. The final cost depends on floor, facing and current
              inventory — request the cost sheet for exact numbers.
            </p>
          </header>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-surface-border bg-background-deep/60 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink-muted">Configuration</dt>
              <dd className="font-medium text-ink">{property.bhk}</dd>
            </div>
            <div className="rounded-xl border border-surface-border bg-background-deep/60 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink-muted">Type</dt>
              <dd className="font-medium text-ink">{property.propertyType}</dd>
            </div>
            <div className="rounded-xl border border-surface-border bg-background-deep/60 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink-muted">Developer</dt>
              <dd className="font-medium text-ink">{property.developerName}</dd>
            </div>
            <div className="rounded-xl border border-surface-border bg-background-deep/60 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink-muted">MahaRERA reg.</dt>
              <dd className="font-medium text-ink">{property.reraNo}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={getWhatsAppHref(enquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex-1"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Get price breakup
            </a>
            <a href={getTelHref()} className="btn-outline flex-1">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call now
            </a>
          </div>
        </div>
      </div>

      <section className="border-y border-surface-border/60 bg-surface/30">
        <div className="container-shell grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-3">
            <p className="section-eyebrow">Amenities</p>
            <h2 className="section-heading">Lifestyle and infrastructure</h2>
            <p className="muted-copy">
              These are the developer&apos;s declared amenities for {property.title}. Confirm the
              phase-wise handover schedule with us before you book.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {property.amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-start gap-2 rounded-xl border border-surface-border bg-background-deep/50 px-4 py-3 text-sm text-ink-muted"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="card-surface grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <p className="section-eyebrow">Site visit</p>
            <h2 className="section-heading">See {property.title} in person</h2>
            <p className="muted-copy">
              We arrange accompanied site visits from our Baner office, including sample-flat access
              where available. Weekend slots fill fast — book a day ahead.
            </p>
            <div className="space-y-2 text-sm text-ink-muted">
              <p className="inline-flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {OFFICE_ADDRESS}
              </p>
              <p className="inline-flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {WORKING_HOURS.weekday.days}: {WORKING_HOURS.weekday.timings} ·{' '}
                {WORKING_HOURS.weekend.days}: {WORKING_HOURS.weekend.timings}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={getWhatsAppHref(
                  `Hi I Realtors, I would like to schedule a site visit for ${property.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Book a site visit
              </a>
              <a
                href={getDirectionsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Office directions
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/25 bg-gold-soft p-6">
            <h3 className="text-base font-semibold text-ink">Compliance quick check</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                Selling agent: {COMPANY_INFO.name} — {RERA_REGISTRATION_LABEL}
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                RERA reference used for this listing: {property.reraNo}
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                Verify every number on the MahaRERA portal before paying any booking amount.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {relatedProperties.length > 0 ? (
        <section className="container-shell space-y-6 pb-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Similar projects</p>
              <h2 className="section-heading">Also worth a look</h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All projects
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProperties.map((related) => (
              <PropertyCard key={related.id} property={related} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}

      <div className="container-shell pb-14">
        <p className="rounded-2xl border border-surface-border bg-background-deep/60 p-5 text-xs leading-relaxed text-ink-muted">
          {RERA_DISCLAIMER}
        </p>
      </div>

      <script
        type="application/ld+json"
        // Structured data is generated from the same data object rendered above.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPropertySchema(property)) }}
      />
    </article>
  );
}
