/**
 * Taxi dispatch numbers by country/region.
 * Cloudflare provides CF-IPCountry header — we match against this.
 * Fallback: international number.
 */
export type Region = {
  country: string;
  countryCode: string;
  phone: string;
  phoneDisplay: string;
  city?: string;
  flag: string;
  currency: string;
};

export const REGIONS: Record<string, Region> = {
  SK: {
    country: 'Slovakia',
    countryCode: 'SK',
    phone: '+421948355017',
    phoneDisplay: '+421 948 355 017',
    city: 'Detva',
    flag: '\u{1F1F8}\u{1F1F0}',
    currency: 'EUR',
  },
  CZ: {
    country: 'Czech Republic',
    countryCode: 'CZ',
    phone: '+421948355017',
    phoneDisplay: '+421 948 355 017',
    flag: '\u{1F1E8}\u{1F1FF}',
    currency: 'CZK',
  },
  HU: {
    country: 'Hungary',
    countryCode: 'HU',
    phone: '+421948355017',
    phoneDisplay: '+421 948 355 017',
    flag: '\u{1F1ED}\u{1F1FA}',
    currency: 'HUF',
  },
  AT: {
    country: 'Austria',
    countryCode: 'AT',
    phone: '+421948355017',
    phoneDisplay: '+421 948 355 017',
    flag: '\u{1F1E6}\u{1F1F9}',
    currency: 'EUR',
  },
  DE: {
    country: 'Germany',
    countryCode: 'DE',
    phone: '+421948355017',
    phoneDisplay: '+421 948 355 017',
    flag: '\u{1F1E9}\u{1F1EA}',
    currency: 'EUR',
  },
};

export const DEFAULT_REGION: Region = {
  country: 'International',
  countryCode: 'INT',
  phone: '+421948355017',
  phoneDisplay: '+421 948 355 017',
  flag: '\u{1F30D}',
  currency: 'EUR',
};

export function getRegion(countryCode: string | null | undefined): Region {
  if (!countryCode) return DEFAULT_REGION;
  return REGIONS[countryCode.toUpperCase()] ?? DEFAULT_REGION;
}
