import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Clock, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

import {
  COMPANY_INFO,
  COMPANY_TAGLINE,
  OFFICE_ADDRESS,
  RERA_DISCLAIMER,
  RERA_NUMBER,
  RERA_REGISTRATION_LABEL,
  WORKING_HOURS,
} from '@/data/company';
import { StickyMobileCta } from '@/components/StickyMobileCta';
import { getMicroLocations } from '@/data/properties';
import { getDirectionsHref, getTelHref, getWhatsAppHref } from '@/lib/contact';
import { SITE_URL } from '@/lib/site';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const HOME_TITLE = `I Realtors | RERA Registered Real Estate Consultant Baner Pune (MahaRERA ${RERA_NUMBER})`;

const HOME_DESCRIPTION = `I Realtors is a MahaRERA registered (Reg. No. ${RERA_NUMBER}) real estate consultancy at Veerbhadra Nagar, Baner, Pune. Explore RERA-verified 2, 3 & 4 BHK projects across Balewadi, Tathawade, Hinjewadi and Pune West with transparent pricing, live inventory updates and guided site visits.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: '%s | I Realtors',
  },
  description: HOME_DESCRIPTION,
  applicationName: COMPANY_INFO.name,
  authors: [{ name: COMPANY_INFO.name, url: SITE_URL }],
  creator: COMPANY_INFO.name,
  publisher: COMPANY_INFO.name,
  category: 'real estate',
  keywords: [
    'I Realtors',
    'real estate consultant Baner Pune',
    'MahaRERA registered agent Pune',
    'RERA verified projects Pune',
    'new projects in Balewadi',
    '3 BHK flats in Balewadi',
    '2 BHK flats in Tathawade',
    'property consultant Pune West',
    'luxury apartments Pune',
    'channel partner Baner Pune',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: COMPANY_INFO.name,
    title: HOME_TITLE,
    description: COMPANY_TAGLINE,
    images: [
      {
        url: '/images/og/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: `${COMPANY_INFO.name} — ${RERA_REGISTRATION_LABEL}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: COMPANY_TAGLINE,
    images: ['/images/og/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B132B',
  colorScheme: 'dark',
};

/**
 * `RealEstateAgent` rich result so Google can surface the office, opening hours
 * and the RERA credential directly in local search results.
 */
const organisationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: COMPANY_INFO.name,
  description: COMPANY_TAGLINE,
  url: SITE_URL,
  telephone: COMPANY_INFO.phone,
  identifier: RERA_REGISTRATION_LABEL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1st Floor, Shree Building, Survey 12, Veerbhadra Nagar Rd, Veerbhadra Nagar',
    addressLocality: 'Baner, Pune',
    addressRegion: 'Maharashtra',
    postalCode: '411045',
    addressCountry: 'IN',
  },
  areaServed: getMicroLocations().map((microLocation) => ({
    '@type': 'Place',
    name: `${microLocation}, Pune`,
  })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      description: `${WORKING_HOURS.weekday.days}: ${WORKING_HOURS.weekday.timings}`,
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday', 'Sunday'],
      description: `${WORKING_HOURS.weekend.days}: ${WORKING_HOURS.weekend.timings}`,
    },
  ],
  hasMap: COMPANY_INFO.googleMapsUrl,
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en-IN" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col pb-[72px] md:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-background-deep"
        >
          Skip to main content
        </a>

        <header className="sticky top-0 z-50 border-b border-surface-border/60 bg-background-deep/85 backdrop-blur-md">
          <div className="container-shell flex h-16 items-center justify-between gap-3">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
              aria-label={`${COMPANY_INFO.name} home`}
            >
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-sheen text-sm font-bold text-background-deep"
              >
                IR
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-semibold tracking-wide text-ink sm:text-base">
                  {COMPANY_INFO.name}
                </span>
                <span className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-gold sm:text-xs">
                  {RERA_REGISTRATION_LABEL}
                </span>
              </span>
            </Link>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-6 text-sm font-medium text-ink-muted md:flex"
            >
              <Link href="/properties" className="transition-colors hover:text-gold">
                Projects
              </Link>
              <Link href="/#featured-projects" className="transition-colors hover:text-gold">
                Featured
              </Link>
              <Link href="/#visit-office" className="transition-colors hover:text-gold">
                Visit office
              </Link>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <a
                href={getWhatsAppHref('Hi I Realtors, please share project details and pricing.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-3.5 py-2 text-xs sm:text-sm"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <a href={getTelHref()} className="btn-gold px-3.5 py-2 text-xs sm:text-sm">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Call now</span>
              </a>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-surface-border/60 bg-background-deep">
          <div className="container-shell grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {COMPANY_INFO.name}
              </h2>
              <p className="muted-copy">{COMPANY_TAGLINE}</p>
              <p className="inline-flex items-center gap-2 text-xs font-medium text-gold">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {RERA_REGISTRATION_LABEL}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Office
              </h2>
              <address className="muted-copy not-italic">{OFFICE_ADDRESS}</address>
              <a
                href={getDirectionsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-ink"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Get directions
              </a>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Working hours
              </h2>
              <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                {WORKING_HOURS.weekday.days}: {WORKING_HOURS.weekday.timings}
              </p>
              <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                {WORKING_HOURS.weekend.days}: {WORKING_HOURS.weekend.timings}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Talk to us
              </h2>
              <a
                href={getTelHref()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {COMPANY_INFO.phone}
              </a>
              <p className="text-sm text-ink-muted">
                WhatsApp:{' '}
                <a
                  href={getWhatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold hover:text-ink"
                >
                  {COMPANY_INFO.whatsappNumber}
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-surface-border/60">
            <div className="container-shell space-y-2 py-6">
              <p className="text-xs leading-relaxed text-ink-muted">{RERA_DISCLAIMER}</p>
              <p className="text-xs text-ink-muted">
                &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <StickyMobileCta />

        <script
          type="application/ld+json"
          // Structured data comes only from the controlled `organisationSchema` object.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
      </body>
    </html>
  );
}
