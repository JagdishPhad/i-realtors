import Link from 'next/link';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

import { getMicroLocations, getPropertyTypes } from '@/data/properties';
import {
  BHK_OPTIONS,
  BUDGET_PRESETS,
  SORT_LABELS,
  buildPropertiesHref,
  hasActiveFilters,
  isBudgetPresetActive,
} from '@/lib/filters';
import { PROPERTY_SORT_KEYS, type PropertyFilters } from '@/types/property';

interface FilterChipProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

/**
 * Filter state lives entirely in the URL, so every chip is a plain `<Link>`:
 * server-rendered, shareable, crawlable and zero client JavaScript. That is a
 * deliberate choice for a mobile-first SEO site (and it keeps the bar a Server
 * Component).
 */
function FilterChip({ href, active, children }: FilterChipProps): JSX.Element {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs transition-colors';
  const state = active
    ? 'border-gold bg-gold font-semibold text-background-deep'
    : 'border-surface-border bg-background-deep/70 font-medium text-ink-muted hover:border-gold/50 hover:text-ink';

  return (
    <Link href={href} className={`${base} ${state}`} aria-current={active ? 'true' : undefined}>
      {children}
    </Link>
  );
}

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

function FilterGroup({ label, children }: FilterGroupProps): JSX.Element {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

interface PropertyFiltersBarProps {
  filters: PropertyFilters;
  resultCount: number;
}

/** Link-based filter controls for `/properties`; renders the live result count. */
export function PropertyFiltersBar({
  filters,
  resultCount,
}: PropertyFiltersBarProps): JSX.Element {
  const microLocations = getMicroLocations();
  const propertyTypes = getPropertyTypes();

  return (
    <section aria-label="Filter projects" className="card-surface space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-gold" aria-hidden="true" />
          {resultCount} {resultCount === 1 ? 'project' : 'projects'}
        </p>
        {hasActiveFilters(filters) ? (
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all filters
          </Link>
        ) : null}
      </div>

      <FilterGroup label="Micro-market">
        <FilterChip
          href={buildPropertiesHref(filters, { microLocation: undefined })}
          active={!filters.microLocation}
        >
          All
        </FilterChip>
        {microLocations.map((microLocation) => (
          <FilterChip
            key={microLocation}
            href={buildPropertiesHref(filters, { microLocation })}
            active={filters.microLocation === microLocation}
          >
            {microLocation}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Budget">
        <FilterChip
          href={buildPropertiesHref(filters, { minPriceRaw: undefined, maxPriceRaw: undefined })}
          active={!filters.minPriceRaw && !filters.maxPriceRaw}
        >
          Any budget
        </FilterChip>
        {BUDGET_PRESETS.map((preset) => (
          <FilterChip
            key={preset.id}
            href={buildPropertiesHref(filters, {
              minPriceRaw: preset.minPriceRaw,
              maxPriceRaw: preset.maxPriceRaw,
            })}
            active={isBudgetPresetActive(filters, preset)}
          >
            {preset.label}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Configuration">
        <FilterChip
          href={buildPropertiesHref(filters, { minBhk: undefined })}
          active={!filters.minBhk}
        >
          Any
        </FilterChip>
        {BHK_OPTIONS.map((bhk) => (
          <FilterChip
            key={bhk}
            href={buildPropertiesHref(filters, { minBhk: bhk })}
            active={filters.minBhk === bhk}
          >
            {bhk}+ BHK
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Type">
        <FilterChip
          href={buildPropertiesHref(filters, { propertyType: undefined })}
          active={!filters.propertyType}
        >
          All types
        </FilterChip>
        {propertyTypes.map((propertyType) => (
          <FilterChip
            key={propertyType}
            href={buildPropertiesHref(filters, { propertyType })}
            active={filters.propertyType === propertyType}
          >
            {propertyType}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Sort">
        {PROPERTY_SORT_KEYS.map((sortKey) => (
          <FilterChip
            key={sortKey}
            href={buildPropertiesHref(filters, { sort: sortKey })}
            active={filters.sort === sortKey}
          >
            {SORT_LABELS[sortKey]}
          </FilterChip>
        ))}
      </FilterGroup>
    </section>
  );
}
