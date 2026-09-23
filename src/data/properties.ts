import { RERA_NUMBER } from '@/data/company';
import type { MicroLocation, Property, PropertyType } from '@/types/property';

/**
 * Seed catalogue for the I Realtors website.
 *
 * Data rules enforced by the `Property` type in `@/types/property`:
 *  - `priceRaw`  : plain number in INR (sorting, range filters, schema.org offers)
 *  - `priceFormatted` : the exact string marketing wants rendered on the card
 *  - `slug`      : unique, kebab-cased, used by `/properties/[slug]`
 *  - `image`     : must equal `coverImages[0]`
 *
 * TODO(content):
 *  - `reraNo` currently mirrors the consultancy's MahaRERA agent number
 *    (A52100000092). Replace each entry with the project's own MahaRERA
 *    registration number once the sales team shares the disclosures.
 *  - Replace the placeholder assets in `public/images/properties/**` with the
 *    developer's approved renders before launch.
 */

/** Atrium Landmarks — Montaire, central Balewadi. */
const montaire: Property = {
  id: 'prop-montaire-balewadi',
  title: 'Montaire',
  slug: 'montaire-balewadi',
  location: 'Balewadi, Pune',
  microLocation: 'Balewadi',
  priceRaw: 15000000,
  priceFormatted: '₹1.50 Cr',
  bhk: '3 & 4 BHK',
  developerName: 'Atrium Landmarks',
  reraNo: RERA_NUMBER,
  image: '/images/properties/montaire-balewadi/cover.jpg',
  coverImages: [
    '/images/properties/montaire-balewadi/cover.jpg',
    '/images/properties/montaire-balewadi/gallery-2.jpg',
    '/images/properties/montaire-balewadi/gallery-3.jpg',
  ],
  amenities: [
    'Clubhouse',
    'Swimming Pool',
    'Fitness Studio',
    'Landscaped Podium',
    'Kids Play Area',
    'Jogging Track',
    '24x7 Security',
    'High-Speed Elevators',
  ],
  propertyType: 'Residential',
  isFeatured: true,
  availability: 'Available',
};

/** Urway Group — Arkaay Tower, Tathawade. */
const arkaayTower: Property = {
  id: 'prop-arkaay-tower-tathawade',
  title: 'Arkaay Tower',
  slug: 'arkaay-tower-tathawade',
  location: 'Tathawade, Pune',
  microLocation: 'Tathawade',
  priceRaw: 9600000,
  priceFormatted: '₹96 Lakhs',
  bhk: '2 & 3 BHK',
  developerName: 'Urway Group',
  reraNo: RERA_NUMBER,
  image: '/images/properties/arkaay-tower-tathawade/cover.jpg',
  coverImages: [
    '/images/properties/arkaay-tower-tathawade/cover.jpg',
    '/images/properties/arkaay-tower-tathawade/gallery-2.jpg',
    '/images/properties/arkaay-tower-tathawade/gallery-3.jpg',
  ],
  amenities: [
    'Grand Entrance Lobby',
    'Gymnasium',
    'Yoga Deck',
    'Rooftop Lounge',
    'Kids Play Area',
    'Amphitheatre',
    'Power Backup',
    'EV Charging Point',
  ],
  propertyType: 'Residential',
  isFeatured: true,
  availability: 'Few Units Left',
};

/** Godrej Properties — Retreat Residences, Pune West. */
const godrejRetreat: Property = {
  id: 'prop-godrej-retreat-residences',
  title: 'Godrej Retreat Residences',
  slug: 'godrej-retreat-residences',
  location: 'Pune',
  microLocation: 'Hinjewadi',
  priceRaw: 8500000,
  priceFormatted: '₹85 Lakhs',
  bhk: '2 & 3 BHK',
  developerName: 'Godrej Properties',
  reraNo: RERA_NUMBER,
  image: '/images/properties/godrej-retreat-residences/cover.jpg',
  coverImages: [
    '/images/properties/godrej-retreat-residences/cover.jpg',
    '/images/properties/godrej-retreat-residences/gallery-2.jpg',
    '/images/properties/godrej-retreat-residences/gallery-3.jpg',
  ],
  amenities: [
    'Resort-Style Clubhouse',
    'Infinity Pool',
    'Mediterranean Garden',
    'Co-Working Lounge',
    'Multipurpose Court',
    'Pet Park',
    'Concierge Desk',
    'Rainwater Harvesting',
  ],
  propertyType: 'Residential',
  isFeatured: true,
  availability: 'Available',
};

/** Lodha Group — Sylvan, Pune West. */
const lodhaSylvan: Property = {
  id: 'prop-lodha-sylvan',
  title: 'Lodha Sylvan',
  slug: 'lodha-sylvan',
  location: 'Pune',
  microLocation: 'Hinjewadi',
  priceRaw: 11000000,
  priceFormatted: '₹1.10 Cr+',
  bhk: '3 & 4 BHK',
  developerName: 'Lodha Group',
  reraNo: RERA_NUMBER,
  image: '/images/properties/lodha-sylvan/cover.jpg',
  coverImages: [
    '/images/properties/lodha-sylvan/cover.jpg',
    '/images/properties/lodha-sylvan/gallery-2.jpg',
    '/images/properties/lodha-sylvan/gallery-3.jpg',
  ],
  amenities: [
    'Sky Lounge',
    'Residents Club',
    'Swimming Pool',
    'Spa & Sauna',
    'Sports Arena',
    'Forest Trail',
    'Business Centre',
    'Smart Home Automation',
  ],
  propertyType: 'Residential',
  isFeatured: true,
  availability: 'Available',
};

/** Full catalogue in curated display order (priciest flagship first). */
export const PROPERTIES: readonly Property[] = [montaire, arkaayTower, godrejRetreat, lodhaSylvan];

/** Listings flagged for the home page `Featured` rail. */
export function getFeaturedProperties(): Property[] {
  return PROPERTIES.filter((property) => property.isFeatured);
}

/** Lookup used by `/properties/[slug]` and the sitemap generator. */
export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((property) => property.slug === slug);
}

/** Distinct micro-markets present in the catalogue, alphabetically sorted. */
export function getMicroLocations(): MicroLocation[] {
  const locations = new Set<MicroLocation>(PROPERTIES.map((property) => property.microLocation));

  return [...locations].sort((a, b) => a.localeCompare(b));
}

/** Distinct residential/commercial buckets present in the catalogue. */
export function getPropertyTypes(): PropertyType[] {
  const types = new Set<PropertyType>(PROPERTIES.map((property) => property.propertyType));

  return [...types].sort((a, b) => a.localeCompare(b));
}

/**
 * Other listings worth showing on a detail page: same micro-market first, then
 * the rest of the catalogue as filler, always excluding the current project.
 */
export function getRelatedProperties(slug: string, limit = 3): Property[] {
  const current = getPropertyBySlug(slug);

  if (!current) {
    return [];
  }

  const sameMarket = PROPERTIES.filter(
    (property) => property.slug !== slug && property.microLocation === current.microLocation,
  );
  const otherMarkets = PROPERTIES.filter(
    (property) => property.slug !== slug && property.microLocation !== current.microLocation,
  );

  return [...sameMarket, ...otherMarkets].slice(0, limit);
}

/** Lowest -> highest `priceRaw`, for budget-first rails. */
export function getPropertiesByPriceAscending(): Property[] {
  return [...PROPERTIES].sort((a, b) => a.priceRaw - b.priceRaw);
}
