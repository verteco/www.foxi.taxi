/**
 * Taxi dispatch numbers by country/region.
 * Each country can have its own operator, phone numbers, and branding.
 */
export type Region = {
  country: string;
  countryCode: string;
  phone: string;
  phoneDisplay: string;
  phoneSecondary?: string;
  phoneSecondaryDisplay?: string;
  city?: string;
  flag: string;
  currency: string;
  operator?: string;
};

export const REGIONS: Record<string, Region> = {
  SK: {
    country: 'Slovensko',
    countryCode: 'SK',
    phone: '+421950706000',
    phoneDisplay: '0950 706 000',
    phoneSecondary: '+421950795150',
    phoneSecondaryDisplay: '0950 795 150',
    city: 'Trebišov',
    flag: '\u{1F1F8}\u{1F1F0}',
    currency: 'EUR',
    operator: 'RS Dolina',
  },
  CZ: {
    country: 'Česko',
    countryCode: 'CZ',
    phone: '+420000000000',
    phoneDisplay: '+420 000 000 000',
    flag: '\u{1F1E8}\u{1F1FF}',
    currency: 'CZK',
    operator: 'Coming soon',
  },
  HU: {
    country: 'Magyarország',
    countryCode: 'HU',
    phone: '+36000000000',
    phoneDisplay: '+36 00 000 0000',
    flag: '\u{1F1ED}\u{1F1FA}',
    currency: 'HUF',
    operator: 'Coming soon',
  },
  PL: {
    country: 'Polska',
    countryCode: 'PL',
    phone: '+48000000000',
    phoneDisplay: '+48 000 000 000',
    flag: '\u{1F1F5}\u{1F1F1}',
    currency: 'PLN',
    operator: 'Coming soon',
  },
  AT: {
    country: 'Österreich',
    countryCode: 'AT',
    phone: '+43000000000',
    phoneDisplay: '+43 000 000 000',
    flag: '\u{1F1E6}\u{1F1F9}',
    currency: 'EUR',
    operator: 'Coming soon',
  },
};

export const DEFAULT_REGION: Region = {
  country: 'International',
  countryCode: 'INT',
  phone: '+421950706000',
  phoneDisplay: '+421 950 706 000',
  flag: '\u{1F30D}',
  currency: 'EUR',
};

export function getRegion(countryCode: string | null | undefined): Region {
  if (!countryCode) return DEFAULT_REGION;
  return REGIONS[countryCode.toUpperCase()] ?? DEFAULT_REGION;
}
