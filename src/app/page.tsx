import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle2, Clock, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

import { PropertyCard } from '@/components/PropertyCard';

import {
  COMPANY_INFO,
  COMPANY_TAGLINE,
  OFFICE_ADDRESS,
  RERA_REGISTRATION_LABEL,
  WORKING_HOURS,
} from '@/data/company';
import { getFeaturedProperties, getMicroLocations } from '@/data/properties';
import { getDirectionsHref, getTelHref, getWhatsAppHref } from '@/lib/contact';

/** Listing card lives in `src/components/PropertyCard.tsx` — shared with `/properties`. */

/**
 * Home page intentionally declares no `metadata` override: the root layout in
 * `src/app/layout.tsx` already publishes the canonical SEO title
 * ("I Realtors | RERA Registered Real Estate Consultant Baner Pune (MahaRERA
 * A52100000092)"), description, Open Graph tags and canonical URL for `/`.
 * Child routes only need `export const metadata` when they add something new.
 */
export default function HomePage(): JSX.Element {
  const featuredProperties = getFeaturedProperties();
  const microLocations = getMicroLocations();

  return (
    <>
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="container-shell grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="animate-fade-up space-y-6">
            <span className="badge">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {RERA_REGISTRATION_LABEL}
            </span>

            <h1 className="text-display-lg font-bold text-ink">
              RERA-verified homes in <span className="text-gradient-gold">Pune West</span>, guided by
              local experts.
            </h1>

            <p className="muted-copy max-w-xl">
              {COMPANY_TAGLINE} Get honest pricing, live inventory and site visits arranged from our
              Baner office — no spam, no hidden charges.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#featured-projects" className="btn-gold">
                Explore featured projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={getWhatsAppHref('Hi I Realtors, please share your current project list.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp us
              </a>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <li className="card-surface flex items-start gap-3 p-5">
              <Building2 className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">
                  {featuredProperties.length} curated projects
                </p>
                <p className="text-sm text-ink-muted">
                  Handpicked 2, 3 &amp; 4 BHK inventory across Balewadi, Tathawade and Hinjewadi.
                </p>
              </div>
            </li>
            <li className="card-surface flex items-start gap-3 p-5">
              <ShieldCheck className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">MahaRERA registered agent</p>
                <p className="text-sm text-ink-muted">
                  Verify our registration {COMPANY_INFO.reraNumber} on the MahaRERA portal.
                </p>
              </div>
            </li>
            <li className="card-surface flex items-start gap-3 p-5">
              <Clock className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">Open Fri–Sun till 9:30 PM</p>
                <p className="text-sm text-ink-muted">
                  Weekend site visits and video walkthroughs on request.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="featured-projects" className="container-shell scroll-mt-20 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Featured inventory</p>
          <h2 className="section-heading mt-3">Handpicked projects in Pune West</h2>
          <p className="muted-copy mt-4">
            Every listing is cross-checked against MahaRERA disclosures. Prices move with the
            developer&apos;s inventory, so message us for today&apos;s exact cost sheet.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/properties" className="btn-outline">
              View all projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="border-y border-surface-border/60 bg-surface/30">
        <div className="container-shell grid gap-8 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="section-eyebrow">Micro-markets we cover</p>
            <h2 className="section-heading mt-3">From our Baner office to your next address</h2>
            <p className="muted-copy mt-4">
              We operate deep, not wide. If a project is not worth your money, we say so — and we
              only recommend inventory we have personally inspected.
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {microLocations.map((microLocation) => (
              <li key={microLocation}>
                <Link
                  href={`/properties?microLocation=${encodeURIComponent(microLocation)}`}
                  className="inline-flex rounded-full border border-surface-border bg-background-deep/70 px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-gold/50 hover:text-ink"
                >
                  {microLocation}, Pune
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="visit-office" className="container-shell scroll-mt-20 py-14 sm:py-20">
        <div className="card-surface grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <p className="section-eyebrow">Visit the office</p>
            <h2 className="section-heading">Walk in for a no-pressure consultation</h2>
            <p className="muted-copy">{OFFICE_ADDRESS}</p>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-background-deep/60 px-4 py-3">
                <Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-muted">
                    {WORKING_HOURS.weekday.days}
                  </dt>
                  <dd className="text-sm font-medium text-ink">{WORKING_HOURS.weekday.timings}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-background-deep/60 px-4 py-3">
                <Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-muted">
                    {WORKING_HOURS.weekend.days}
                  </dt>
                  <dd className="text-sm font-medium text-ink">{WORKING_HOURS.weekend.timings}</dd>
                </div>
              </div>
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={getTelHref()} className="btn-gold">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {COMPANY_INFO.phone}
              </a>
              <a
                href={getWhatsAppHref('Hi I Realtors, I would like to schedule a consultation.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href={getDirectionsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Directions
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/25 bg-gold-soft p-6">
            <h2 className="text-base font-semibold text-ink">What you get with I Realtors</h2>
            <ul className="mt-4 space-y-3">
              {[
                'Transparent cost sheet with all charges',
                'MahaRERA disclosure & inventory check',
                'Site visits arranged from the Baner office',
                'Home loan and registration coordination',
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-ink-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
