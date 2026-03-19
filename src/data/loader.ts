/**
 * Auto-loads all country JSON files from src/data/countries/
 * and provides typed access for page generation.
 *
 * To add a new country: drop a JSON file in src/data/countries/
 * following the CountryJson schema — pages are generated automatically.
 */
import type { CountryJson, CityWithContext, RegionWithContext } from './types';

// Auto-discover all country JSONs at build time
const countryModules = import.meta.glob('./countries/*.json', { eager: true }) as Record<string, { default: CountryJson }>;

const countries: CountryJson[] = Object.values(countryModules).map(m => m.default);

// --- Indexes ---

/** All countries keyed by countryCode */
const byCode = new Map<string, CountryJson>();
/** All countries keyed by lang */
const byLang = new Map<string, CountryJson>();

for (const c of countries) {
  byCode.set(c.countryCode, c);
  byLang.set(c.lang, c);
}

// --- Region map per country ---
function getRegionName(country: CountryJson, regionSlug: string): string {
  return country.regions.find(r => r.slug === regionSlug)?.name ?? regionSlug;
}

// --- Determine if a city's region is indexable ---
function isCityIndexable(city: CountryJson['cities'][0], country: CountryJson): boolean {
  if (!country.indexable) return false;
  // If indexableRegions is set, only those regions are indexed
  if (country.indexableRegions && country.indexableRegions.length > 0) {
    return country.indexableRegions.includes(city.region);
  }
  return true;
}

// --- Build CityWithContext ---
function buildCity(city: CountryJson['cities'][0], country: CountryJson): CityWithContext {
  const hasPhone = !!city.phone;
  return {
    slug: city.slug,
    name: city.name,
    lat: city.lat,
    lng: city.lng,
    phone: city.phone ?? country.defaultPhone,
    phoneDisplay: city.phoneDisplay ?? country.defaultPhoneDisplay,
    phoneSecondary: city.phoneSecondary ?? country.defaultPhoneSecondary ?? undefined,
    phoneSecondaryDisplay: city.phoneSecondaryDisplay ?? country.defaultPhoneSecondaryDisplay ?? undefined,
    operator: city.operator ?? country.operator,
    isActive: hasPhone,
    countryCode: country.countryCode,
    countryName: country.countryName,
    flag: country.flag,
    currency: country.currency,
    lang: country.lang,
    indexable: isCityIndexable(city, country),
    regionSlug: city.region,
    regionName: getRegionName(country, city.region),
  };
}

// --- Public API ---

/** All loaded countries */
export function getAllCountries(): CountryJson[] {
  return countries;
}

/** Get country by ISO code */
export function getCountry(code: string): CountryJson | undefined {
  return byCode.get(code.toUpperCase());
}

/** Get country by language code */
export function getCountryByLang(lang: string): CountryJson | undefined {
  return byLang.get(lang);
}

/** All supported language codes (derived from JSON files) */
export function getSupportedLangs(): string[] {
  return countries.map(c => c.lang);
}

/** All cities for a given language, with full context */
export function getCitiesForLang(lang: string): CityWithContext[] {
  const country = byLang.get(lang);
  if (!country) return [];
  return country.cities.map(c => buildCity(c, country));
}

/** Find a single city by lang + slug */
export function findCity(lang: string, slug: string): CityWithContext | undefined {
  const country = byLang.get(lang);
  if (!country) return undefined;
  const city = country.cities.find(c => c.slug === slug);
  if (!city) return undefined;
  return buildCity(city, country);
}

/** All regions for a language, each with its cities */
export function getRegionsForLang(lang: string): RegionWithContext[] {
  const country = byLang.get(lang);
  if (!country) return [];
  return country.regions.map(r => ({
    slug: r.slug,
    name: r.name,
    countryCode: country.countryCode,
    countryName: country.countryName,
    flag: country.flag,
    lang: country.lang,
    indexable: country.indexable,
    cities: country.cities
      .filter(c => c.region === r.slug)
      .map(c => buildCity(c, country)),
  }));
}

/** Find a region by lang + slug */
export function findRegion(lang: string, slug: string): RegionWithContext | undefined {
  return getRegionsForLang(lang).find(r => r.slug === slug);
}

/** Check if a lang homepage should be indexed by Google */
export function isLangIndexable(lang: string): boolean {
  return byLang.get(lang)?.indexable ?? false;
}

/** Get only the cities that should be indexed (for sitemap) */
export function getIndexableCities(): CityWithContext[] {
  return countries.flatMap(c => c.cities.map(city => buildCity(city, c)).filter(city => city.indexable));
}

/** Region data for geolocation (used in client-side script) */
export function getRegionsForGeo(): Record<string, {
  phone: string;
  display: string;
  country: string;
  city?: string;
  flag: string;
  operator: string;
  phoneSecondary?: string;
  phoneSecondaryDisplay?: string;
}> {
  const result: Record<string, any> = {};
  for (const c of countries) {
    result[c.countryCode] = {
      phone: c.defaultPhone,
      display: c.defaultPhoneDisplay,
      country: c.countryName,
      flag: c.flag,
      operator: c.operator,
      phoneSecondary: c.defaultPhoneSecondary,
      phoneSecondaryDisplay: c.defaultPhoneSecondaryDisplay,
    };
  }
  return result;
}

/** Default region (SK) for initial page render */
export function getDefaultRegion() {
  const sk = byCode.get('SK')!;
  return {
    country: sk.countryName,
    countryCode: sk.countryCode,
    phone: sk.defaultPhone,
    phoneDisplay: sk.defaultPhoneDisplay,
    phoneSecondary: sk.defaultPhoneSecondary,
    phoneSecondaryDisplay: sk.defaultPhoneSecondaryDisplay,
    flag: sk.flag,
    currency: sk.currency,
    operator: sk.operator,
  };
}
