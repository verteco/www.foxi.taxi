export type City = {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  phone?: string;
  phoneDisplay?: string;
  phoneSecondary?: string;
  phoneSecondaryDisplay?: string;
  operator?: string;
  lat: number;
  lng: number;
};

export const CITIES: Record<string, City[]> = {
  sk: [
    { slug: 'bratislava', name: 'Bratislava', country: 'Slovensko', countryCode: 'SK', lat: 48.15, lng: 17.11 },
    { slug: 'kosice', name: 'Košice', country: 'Slovensko', countryCode: 'SK', lat: 48.72, lng: 21.26 },
    { slug: 'presov', name: 'Prešov', country: 'Slovensko', countryCode: 'SK', lat: 48.99, lng: 21.24 },
    { slug: 'zilina', name: 'Žilina', country: 'Slovensko', countryCode: 'SK', lat: 49.22, lng: 18.74 },
    { slug: 'banska-bystrica', name: 'Banská Bystrica', country: 'Slovensko', countryCode: 'SK', lat: 48.74, lng: 19.15 },
    { slug: 'nitra', name: 'Nitra', country: 'Slovensko', countryCode: 'SK', lat: 48.31, lng: 18.09 },
    { slug: 'trnava', name: 'Trnava', country: 'Slovensko', countryCode: 'SK', lat: 48.38, lng: 17.59 },
    { slug: 'trencin', name: 'Trenčín', country: 'Slovensko', countryCode: 'SK', lat: 48.89, lng: 18.04 },
    { slug: 'poprad', name: 'Poprad', country: 'Slovensko', countryCode: 'SK', lat: 49.06, lng: 20.30 },
    { slug: 'trebisov', name: 'Trebišov', country: 'Slovensko', countryCode: 'SK', phone: '+421950706000', phoneDisplay: '0950 706 000', phoneSecondary: '+421950795150', phoneSecondaryDisplay: '0950 795 150', operator: 'RS Dolina', lat: 48.63, lng: 21.72 },
    { slug: 'michalovce', name: 'Michalovce', country: 'Slovensko', countryCode: 'SK', lat: 48.76, lng: 21.92 },
    { slug: 'detva', name: 'Detva', country: 'Slovensko', countryCode: 'SK', lat: 48.56, lng: 19.42 },
  ],
  cs: [
    { slug: 'praha', name: 'Praha', country: 'Česko', countryCode: 'CZ', lat: 50.08, lng: 14.44 },
    { slug: 'brno', name: 'Brno', country: 'Česko', countryCode: 'CZ', lat: 49.20, lng: 16.61 },
    { slug: 'ostrava', name: 'Ostrava', country: 'Česko', countryCode: 'CZ', lat: 49.83, lng: 18.29 },
    { slug: 'plzen', name: 'Plzeň', country: 'Česko', countryCode: 'CZ', lat: 49.74, lng: 13.38 },
    { slug: 'liberec', name: 'Liberec', country: 'Česko', countryCode: 'CZ', lat: 50.77, lng: 15.06 },
    { slug: 'olomouc', name: 'Olomouc', country: 'Česko', countryCode: 'CZ', lat: 49.59, lng: 17.25 },
    { slug: 'ceske-budejovice', name: 'České Budějovice', country: 'Česko', countryCode: 'CZ', lat: 48.97, lng: 14.47 },
    { slug: 'hradec-kralove', name: 'Hradec Králové', country: 'Česko', countryCode: 'CZ', lat: 50.21, lng: 15.83 },
    { slug: 'pardubice', name: 'Pardubice', country: 'Česko', countryCode: 'CZ', lat: 50.04, lng: 15.78 },
    { slug: 'zlin', name: 'Zlín', country: 'Česko', countryCode: 'CZ', lat: 49.23, lng: 17.67 },
  ],
  hu: [
    { slug: 'budapest', name: 'Budapest', country: 'Magyarország', countryCode: 'HU', lat: 47.50, lng: 19.04 },
    { slug: 'debrecen', name: 'Debrecen', country: 'Magyarország', countryCode: 'HU', lat: 47.53, lng: 21.63 },
    { slug: 'szeged', name: 'Szeged', country: 'Magyarország', countryCode: 'HU', lat: 46.25, lng: 20.15 },
    { slug: 'miskolc', name: 'Miskolc', country: 'Magyarország', countryCode: 'HU', lat: 48.10, lng: 20.78 },
    { slug: 'pecs', name: 'Pécs', country: 'Magyarország', countryCode: 'HU', lat: 46.07, lng: 18.23 },
    { slug: 'gyor', name: 'Győr', country: 'Magyarország', countryCode: 'HU', lat: 47.69, lng: 17.63 },
    { slug: 'nyiregyhaza', name: 'Nyíregyháza', country: 'Magyarország', countryCode: 'HU', lat: 47.96, lng: 21.72 },
    { slug: 'kecskemet', name: 'Kecskemét', country: 'Magyarország', countryCode: 'HU', lat: 46.91, lng: 19.69 },
  ],
  pl: [
    { slug: 'warszawa', name: 'Warszawa', country: 'Polska', countryCode: 'PL', lat: 52.23, lng: 21.01 },
    { slug: 'krakow', name: 'Kraków', country: 'Polska', countryCode: 'PL', lat: 50.06, lng: 19.94 },
    { slug: 'wroclaw', name: 'Wrocław', country: 'Polska', countryCode: 'PL', lat: 51.11, lng: 17.04 },
    { slug: 'poznan', name: 'Poznań', country: 'Polska', countryCode: 'PL', lat: 52.41, lng: 16.93 },
    { slug: 'gdansk', name: 'Gdańsk', country: 'Polska', countryCode: 'PL', lat: 54.35, lng: 18.65 },
    { slug: 'katowice', name: 'Katowice', country: 'Polska', countryCode: 'PL', lat: 50.26, lng: 19.02 },
    { slug: 'lodz', name: 'Łódź', country: 'Polska', countryCode: 'PL', lat: 51.76, lng: 19.46 },
    { slug: 'rzeszow', name: 'Rzeszów', country: 'Polska', countryCode: 'PL', lat: 50.04, lng: 22.00 },
  ],
  de: [
    { slug: 'wien', name: 'Wien', country: 'Österreich', countryCode: 'AT', lat: 48.21, lng: 16.37 },
    { slug: 'graz', name: 'Graz', country: 'Österreich', countryCode: 'AT', lat: 47.07, lng: 15.44 },
    { slug: 'linz', name: 'Linz', country: 'Österreich', countryCode: 'AT', lat: 48.31, lng: 14.29 },
    { slug: 'salzburg', name: 'Salzburg', country: 'Österreich', countryCode: 'AT', lat: 47.80, lng: 13.04 },
    { slug: 'innsbruck', name: 'Innsbruck', country: 'Österreich', countryCode: 'AT', lat: 47.26, lng: 11.39 },
  ],
};

/** Get all cities for a language, or all cities flattened */
export function getCitiesForLang(lang: string): City[] {
  return CITIES[lang] ?? [];
}

export function getAllCities(): City[] {
  return Object.values(CITIES).flat();
}

export function findCity(lang: string, slug: string): City | undefined {
  return getCitiesForLang(lang).find(c => c.slug === slug);
}
