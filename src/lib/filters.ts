import {
  MICRO_LOCATIONS,
  PROPERTY_SORT_KEYS,
  PROPERTY_TYPES,
  type MicroLocation,
  type Property,
  type PropertyFilters,
  type PropertySortKey,
  type PropertyType,
} from '@/types/property';

/**
 * Filtering, sorting and URL serialisation for the `/properties` listing page.
 *
 * Everything here is pure and framework-agnostic: the page component passes raw
 * `searchParams` in, gets a total `PropertyFilters` object back, and renders the
 * matching slice of the catalogue. No filtering logic lives in JSX.
 */

/** Shape of `searchParams` as handed to a Next.js App Router page. */
export type SearchParamsInput = Record<string, string | string[] | undefined>;

/** One budget chip in the filter bar. */
export interface BudgetPreset {
  id: string;
  label: string;
  minPriceRaw?: number;
  maxPriceRaw?: number;
}

/** Budget bands tuned to the Pune West micro-markets we sell in. */
export const BUDGET_PRESETS: readonly BudgetPreset[] = [
  { id: 'under-1cr', label: 'Under ₹1 Cr', maxPriceRaw: 10000000 },
  { id: '1cr-to-1.5cr', label: '₹1 Cr – ₹1.5 Cr', minPriceRaw: 10000000, maxPriceRaw: 15000000 },
  { id: 'above-1.5cr', label: 'Above ₹1.5 Cr', minPriceRaw: 15000000 },
];

/** Bedroom counts offered as chips; `minBhk` means "this many or more". */
export const BHK_OPTIONS: readonly number[] = [2, 3, 4];

/** Human labels for the sort control. */
export const SORT_LABELS: Record<PropertySortKey, string> = {
  'featured-first': 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
};

/**
 * Bedroom counts declared in a configuration string.
 * `'3 & 4 BHK'` -> `[3, 4]`, `'2 & 3 BHK'` -> `[2, 3]`.
 */
export function extractBhkCounts(bhk: string): number[] {
  const matches = bhk.match(/\d+/g);

  return matches ? matches.map(Number) : [];
}

function firstValue(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();

  return trimmed ? trimmed : undefined;
}

function toPositiveNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function isMicroLocation(value: string): value is MicroLocation {
  return (MICRO_LOCATIONS as readonly string[]).includes(value);
}

function isPropertyType(value: string): value is PropertyType {
  return (PROPERTY_TYPES as readonly string[]).includes(value);
}

function isSortKey(value: string): value is PropertySortKey {
  return (PROPERTY_SORT_KEYS as readonly string[]).includes(value);
}

/**
 * Validates raw query-string input into a total `PropertyFilters` object.
 * Unknown or malformed values are dropped rather than throwing, so a hand-edited
 * URL can never break the page or leak an invalid union member.
 */
export function parsePropertyFilters(searchParams: SearchParamsInput): PropertyFilters {
  const microLocation = firstValue(searchParams.microLocation);
  const propertyType = firstValue(searchParams.propertyType);
  const minBhk = toPositiveNumber(firstValue(searchParams.minBhk));
  const sort = firstValue(searchParams.sort);

  return {
    microLocation: microLocation && isMicroLocation(microLocation) ? microLocation : undefined,
    propertyType: propertyType && isPropertyType(propertyType) ? propertyType : undefined,
    minBhk: minBhk ? Math.floor(minBhk) : undefined,
    minPriceRaw: toPositiveNumber(firstValue(searchParams.minPrice)),
    maxPriceRaw: toPositiveNumber(firstValue(searchParams.maxPrice)),
    sort: sort && isSortKey(sort) ? sort : 'featured-first',
  };
}

/** Applies the validated filters and sort order to a catalogue slice. */
export function filterProperties(
  properties: readonly Property[],
  filters: PropertyFilters,
): Property[] {
  const minBhk = filters.minBhk ?? 0;
  const minPriceRaw = filters.minPriceRaw ?? 0;
  const maxPriceRaw = filters.maxPriceRaw ?? Number.POSITIVE_INFINITY;

  const matches = properties.filter((property) => {
    const matchesMicroLocation =
      !filters.microLocation || property.microLocation === filters.microLocation;
    const matchesPropertyType =
      !filters.propertyType || property.propertyType === filters.propertyType;
    const matchesBudget = property.priceRaw >= minPriceRaw && property.priceRaw <= maxPriceRaw;
    const matchesBhk =
      minBhk === 0 || extractBhkCounts(property.bhk).some((count) => count >= minBhk);

    return matchesMicroLocation && matchesPropertyType && matchesBudget && matchesBhk;
  });

  return sortProperties(matches, filters.sort);
}

/** Stable sort helper. `featured-first` breaks ties on price for a sane order. */
export function sortProperties(
  properties: readonly Property[],
  sort: PropertySortKey,
): Property[] {
  const sorted = [...properties];

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.priceRaw - b.priceRaw);
    case 'price-desc':
      return sorted.sort((a, b) => b.priceRaw - a.priceRaw);
    case 'featured-first':
    default:
      return sorted.sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.priceRaw - b.priceRaw,
      );
  }
}

/**
 * Serialises filters into a `/properties` URL. Passing an explicit `undefined`
 * in `overrides` clears that key, which is how the filter chips toggle off.
 * Defaults (`sort: 'featured-first'`, no budget) are omitted to keep URLs clean.
 */
export function buildPropertiesHref(
  filters: Partial<PropertyFilters>,
  overrides: Partial<PropertyFilters> = {},
): string {
  const merged: Partial<PropertyFilters> = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (merged.microLocation) {
    params.set('microLocation', merged.microLocation);
  }

  if (merged.propertyType) {
    params.set('propertyType', merged.propertyType);
  }

  if (merged.minBhk) {
    params.set('minBhk', String(merged.minBhk));
  }

  if (merged.minPriceRaw) {
    params.set('minPrice', String(merged.minPriceRaw));
  }

  if (merged.maxPriceRaw) {
    params.set('maxPrice', String(merged.maxPriceRaw));
  }

  if (merged.sort && merged.sort !== 'featured-first') {
    params.set('sort', merged.sort);
  }

  const query = params.toString();

  return query ? `/properties?${query}` : '/properties';
}

/** True when the current budget exactly matches a preset (used for chip state). */
export function isBudgetPresetActive(filters: PropertyFilters, preset: BudgetPreset): boolean {
  return filters.minPriceRaw === preset.minPriceRaw && filters.maxPriceRaw === preset.maxPriceRaw;
}

/** True when any narrowing filter is applied — drives the "Clear all" affordance. */
export function hasActiveFilters(filters: PropertyFilters): boolean {
  return Boolean(
    filters.microLocation ||
      filters.propertyType ||
      filters.minBhk ||
      filters.minPriceRaw ||
      filters.maxPriceRaw ||
      filters.sort !== 'featured-first',
  );
}
