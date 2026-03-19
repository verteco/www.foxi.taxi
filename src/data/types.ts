/** Shared types for the country/city data layer */

export interface CityJson {
  slug: string;
  name: string;
  region: string;           // region slug (e.g. "kosicky-kraj")
  lat: number;
  lng: number;
  description?: string | null;
  phone?: string | null;
  phoneDisplay?: string | null;
  phoneSecondary?: string | null;
  phoneSecondaryDisplay?: string | null;
  operator?: string | null;
}

export interface RegionJson {
  slug: string;
  name: string;             // display name in local language
}

export interface CountryJson {
  countryCode: string;      // ISO 3166-1 alpha-2 (SK, CZ, PL, RO, HU)
  lang: string;             // primary language code for URL (sk, cs, pl, ro, hu)
  countryName: string;      // local name (Slovensko, Česko, ...)
  flag: string;             // emoji flag
  currency: string;
  defaultPhone: string;
  defaultPhoneDisplay: string;
  defaultPhoneSecondary?: string | null;
  defaultPhoneSecondaryDisplay?: string | null;
  operator: string;         // default operator name or "Coming soon"
  indexable: boolean;       // country-level default for Google indexing
  indexableRegions?: string[];  // if set, only these region slugs are indexed (overrides indexable)
  regions: RegionJson[];
  cities: CityJson[];
}

/** City with resolved country/region context — used in templates */
export interface CityWithContext {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  // Phone (city-level or country default)
  phone: string;
  phoneDisplay: string;
  phoneSecondary?: string;
  phoneSecondaryDisplay?: string;
  operator: string;
  isActive: boolean;        // has a real phone number (not coming soon)
  // Country context
  countryCode: string;
  countryName: string;
  flag: string;
  currency: string;
  lang: string;
  indexable: boolean;
  // Region
  regionSlug: string;
  regionName: string;
}

export interface RegionWithContext {
  slug: string;
  name: string;
  countryCode: string;
  countryName: string;
  flag: string;
  lang: string;
  indexable: boolean;
  cities: CityWithContext[];
}
