/**
 * Domain model for the I Realtors catalogue and brand information.
 *
 * Every consumer (listing grids, detail pages, JSON-LD builders, lead forms)
 * imports these types from `@/types/property`, so the data layer stays the
 * single source of truth and cannot drift from the UI.
 */

/**
 * Runtime-inspectable option lists.
 *
 * Declaring each union from an `as const` array keeps one source of truth:
 * TypeScript stays exhaustive (`MicroLocation` etc.) while `parsePropertyFilters`
 * can validate raw query-string values against the very same list instead of
 * maintaining a parallel array that can drift.
 */
export const PROPERTY_TYPES = ['Residential', 'Commercial'] as const;

/** High level asset classification used by filters and card badges. */
export type PropertyType = (typeof PROPERTY_TYPES)[number];

/**
 * Micro-markets I Realtors actively sells out of the Baner (Pune West) office.
 * Adding a market here keeps `Property.microLocation` exhaustive and typo-proof.
 */
export const MICRO_LOCATIONS = [
  'Baner',
  'Balewadi',
  'Tathawade',
  'Wakad',
  'Punawale',
  'Hinjewadi',
  'Pune',
] as const;

export type MicroLocation = (typeof MICRO_LOCATIONS)[number];

/** Selling state surfaced as a badge on cards and detail pages. */
export const AVAILABILITY_STATUSES = ['Available', 'Few Units Left', 'Sold Out'] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

/**
 * A single sellable project / unit cluster.
 *
 * Prices are stored twice on purpose: `priceRaw` powers sorting, filtering and
 * schema.org offers, while `priceFormatted` is the exact string the marketing
 * team wants rendered (e.g. `₹1.50 Cr`).
 */
export interface Property {
  /** Stable, URL-safe identifier (never shown to users). */
  id: string;
  /** Marketing title of the project. */
  title: string;
  /** Route segment for `/properties/[slug]`; must be unique across the catalogue. */
  slug: string;
  /** Display locality line, e.g. `Balewadi, Pune`. */
  location: string;
  /** Canonical micro-market used for filtering and local SEO. */
  microLocation: MicroLocation;
  /** Numeric price in INR — used for sorting/range filters and structured data. */
  priceRaw: number;
  /** Pre-formatted price label, e.g. `₹1.50 Cr`, `₹96 Lakhs`, `₹1.10 Cr+`. */
  priceFormatted: string;
  /** Configuration summary, e.g. `3 & 4 BHK`. */
  bhk: string;
  /** RERA-registered developer / promoter name. */
  developerName: string;
  /** MahaRERA project or agent registration number applicable to the listing. */
  reraNo: string;
  /** Primary (card / OG) image path or absolute CDN URL. */
  image: string;
  /** Ordered gallery, first entry is treated as the hero shot. */
  coverImages: string[];
  /** Amenity labels rendered as chips on the detail page. */
  amenities: string[];
  propertyType: PropertyType;
  /** Highlighted on the home page `Featured` rail when `true`. */
  isFeatured: boolean;
  /** Optional sales status badge; defaults to `Available` in the UI when omitted. */
  availability?: AvailabilityStatus;
}

/** Minimal projection consumed by listing cards — avoids passing gallery data around. */
export type PropertyCardModel = Pick<
  Property,
  | 'id'
  | 'title'
  | 'slug'
  | 'location'
  | 'microLocation'
  | 'priceFormatted'
  | 'bhk'
  | 'image'
  | 'propertyType'
  | 'isFeatured'
  | 'availability'
>;

/** Sort orders offered on the `/properties` listing page. */
export const PROPERTY_SORT_KEYS = ['featured-first', 'price-asc', 'price-desc'] as const;

export type PropertySortKey = (typeof PROPERTY_SORT_KEYS)[number];

/**
 * Normalised, already-validated listing filters.
 *
 * `sort` is required (not optional) so every consumer — data helpers, filter
 * chips, result counts — receives a total object and never has to guess a
 * default. `parsePropertyFilters` is the only place raw query strings are read.
 */
export interface PropertyFilters {
  microLocation?: MicroLocation;
  propertyType?: PropertyType;
  /** Keep only listings that offer at least this many bedrooms. */
  minBhk?: number;
  minPriceRaw?: number;
  maxPriceRaw?: number;
  sort: PropertySortKey;
}

/** One row of the office opening-hours table. */
export interface WorkingHoursSlot {
  /** Day label, e.g. `Mon – Thu`. */
  days: string;
  /** Opening to closing time, e.g. `9:30 AM – 7:30 PM`. */
  timings: string;
}

/** Office hours split by weekday/weekend as published on the contact page. */
export interface WorkingHours {
  weekday: WorkingHoursSlot;
  weekend: WorkingHoursSlot;
}

/** Verified business identity used across metadata, footer, contact and JSON-LD. */
export interface CompanyInfo {
  name: string;
  /** MahaRERA agent registration number (`A52100000092`). */
  reraNumber: string;
  /** Full postal address of the Baner office. */
  address: string;
  /** Dialable phone number, E.164 friendly, used for `tel:` links. */
  phone: string;
  /** WhatsApp number in international format without punctuation, used for `wa.me` links. */
  whatsappNumber: string;
  /** Google Maps deep link for the office location. */
  googleMapsUrl: string;
  workingHours: WorkingHours;
}
