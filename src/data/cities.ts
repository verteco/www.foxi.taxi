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

// Trebišov area — active with RS Dolina
const TREBISOV_PHONE = { phone: '+421950706000', phoneDisplay: '0950 706 000', phoneSecondary: '+421950795150', phoneSecondaryDisplay: '0950 795 150', operator: 'RS Dolina' };

export const CITIES: Record<string, City[]> = {
  sk: [
    // Bratislavský kraj
    { slug: 'bratislava', name: 'Bratislava', country: 'Slovensko', countryCode: 'SK', lat: 48.15, lng: 17.11 },
    { slug: 'malacky', name: 'Malacky', country: 'Slovensko', countryCode: 'SK', lat: 48.44, lng: 17.02 },
    { slug: 'pezinok', name: 'Pezinok', country: 'Slovensko', countryCode: 'SK', lat: 48.29, lng: 17.27 },
    { slug: 'senec', name: 'Senec', country: 'Slovensko', countryCode: 'SK', lat: 48.22, lng: 17.40 },
    // Trnavský kraj
    { slug: 'trnava', name: 'Trnava', country: 'Slovensko', countryCode: 'SK', lat: 48.38, lng: 17.59 },
    { slug: 'dunajska-streda', name: 'Dunajská Streda', country: 'Slovensko', countryCode: 'SK', lat: 47.99, lng: 17.62 },
    { slug: 'galanta', name: 'Galanta', country: 'Slovensko', countryCode: 'SK', lat: 48.19, lng: 17.73 },
    { slug: 'hlohovec', name: 'Hlohovec', country: 'Slovensko', countryCode: 'SK', lat: 48.43, lng: 17.80 },
    { slug: 'piestany', name: 'Piešťany', country: 'Slovensko', countryCode: 'SK', lat: 48.59, lng: 17.83 },
    { slug: 'senica', name: 'Senica', country: 'Slovensko', countryCode: 'SK', lat: 48.68, lng: 17.37 },
    { slug: 'skalica', name: 'Skalica', country: 'Slovensko', countryCode: 'SK', lat: 48.85, lng: 17.23 },
    // Trenčiansky kraj
    { slug: 'trencin', name: 'Trenčín', country: 'Slovensko', countryCode: 'SK', lat: 48.89, lng: 18.04 },
    { slug: 'banovce-nad-bebravou', name: 'Bánovce nad Bebravou', country: 'Slovensko', countryCode: 'SK', lat: 48.72, lng: 18.26 },
    { slug: 'ilava', name: 'Ilava', country: 'Slovensko', countryCode: 'SK', lat: 48.97, lng: 18.23 },
    { slug: 'myjava', name: 'Myjava', country: 'Slovensko', countryCode: 'SK', lat: 48.76, lng: 17.57 },
    { slug: 'nove-mesto-nad-vahom', name: 'Nové Mesto nad Váhom', country: 'Slovensko', countryCode: 'SK', lat: 48.76, lng: 17.83 },
    { slug: 'partizanske', name: 'Partizánske', country: 'Slovensko', countryCode: 'SK', lat: 48.63, lng: 18.38 },
    { slug: 'povazska-bystrica', name: 'Považská Bystrica', country: 'Slovensko', countryCode: 'SK', lat: 49.12, lng: 18.44 },
    { slug: 'prievidza', name: 'Prievidza', country: 'Slovensko', countryCode: 'SK', lat: 48.77, lng: 18.62 },
    { slug: 'puchov', name: 'Púchov', country: 'Slovensko', countryCode: 'SK', lat: 49.12, lng: 18.33 },
    // Nitriansky kraj
    { slug: 'nitra', name: 'Nitra', country: 'Slovensko', countryCode: 'SK', lat: 48.31, lng: 18.09 },
    { slug: 'komarno', name: 'Komárno', country: 'Slovensko', countryCode: 'SK', lat: 47.76, lng: 18.12 },
    { slug: 'levice', name: 'Levice', country: 'Slovensko', countryCode: 'SK', lat: 48.22, lng: 18.60 },
    { slug: 'nove-zamky', name: 'Nové Zámky', country: 'Slovensko', countryCode: 'SK', lat: 47.99, lng: 18.16 },
    { slug: 'sala', name: 'Šaľa', country: 'Slovensko', countryCode: 'SK', lat: 48.15, lng: 17.88 },
    { slug: 'topolcany', name: 'Topoľčany', country: 'Slovensko', countryCode: 'SK', lat: 48.56, lng: 18.18 },
    { slug: 'zlate-moravce', name: 'Zlaté Moravce', country: 'Slovensko', countryCode: 'SK', lat: 48.38, lng: 18.40 },
    // Žilinský kraj
    { slug: 'zilina', name: 'Žilina', country: 'Slovensko', countryCode: 'SK', lat: 49.22, lng: 18.74 },
    { slug: 'bytca', name: 'Bytča', country: 'Slovensko', countryCode: 'SK', lat: 49.22, lng: 18.56 },
    { slug: 'cadca', name: 'Čadca', country: 'Slovensko', countryCode: 'SK', lat: 49.44, lng: 18.79 },
    { slug: 'dolny-kubin', name: 'Dolný Kubín', country: 'Slovensko', countryCode: 'SK', lat: 49.21, lng: 19.30 },
    { slug: 'kysucke-nove-mesto', name: 'Kysucké Nové Mesto', country: 'Slovensko', countryCode: 'SK', lat: 49.30, lng: 18.79 },
    { slug: 'liptovsky-mikulas', name: 'Liptovský Mikuláš', country: 'Slovensko', countryCode: 'SK', lat: 49.08, lng: 19.62 },
    { slug: 'martin', name: 'Martin', country: 'Slovensko', countryCode: 'SK', lat: 49.07, lng: 18.92 },
    { slug: 'namestovo', name: 'Námestovo', country: 'Slovensko', countryCode: 'SK', lat: 49.41, lng: 19.48 },
    { slug: 'ruzomberok', name: 'Ružomberok', country: 'Slovensko', countryCode: 'SK', lat: 49.07, lng: 19.31 },
    { slug: 'turcianske-teplice', name: 'Turčianske Teplice', country: 'Slovensko', countryCode: 'SK', lat: 48.87, lng: 18.86 },
    { slug: 'tvrdosin', name: 'Tvrdošín', country: 'Slovensko', countryCode: 'SK', lat: 49.34, lng: 19.56 },
    // Banskobystrický kraj
    { slug: 'banska-bystrica', name: 'Banská Bystrica', country: 'Slovensko', countryCode: 'SK', lat: 48.74, lng: 19.15 },
    { slug: 'banska-stiavnica', name: 'Banská Štiavnica', country: 'Slovensko', countryCode: 'SK', lat: 48.46, lng: 18.89 },
    { slug: 'brezno', name: 'Brezno', country: 'Slovensko', countryCode: 'SK', lat: 48.81, lng: 19.64 },
    { slug: 'detva', name: 'Detva', country: 'Slovensko', countryCode: 'SK', lat: 48.56, lng: 19.42 },
    { slug: 'krupina', name: 'Krupina', country: 'Slovensko', countryCode: 'SK', lat: 48.35, lng: 19.07 },
    { slug: 'lucenec', name: 'Lučenec', country: 'Slovensko', countryCode: 'SK', lat: 48.33, lng: 19.67 },
    { slug: 'poltar', name: 'Poltár', country: 'Slovensko', countryCode: 'SK', lat: 48.43, lng: 19.79 },
    { slug: 'revuca', name: 'Revúca', country: 'Slovensko', countryCode: 'SK', lat: 48.68, lng: 20.12 },
    { slug: 'rimavska-sobota', name: 'Rimavská Sobota', country: 'Slovensko', countryCode: 'SK', lat: 48.38, lng: 20.02 },
    { slug: 'velky-krtis', name: 'Veľký Krtíš', country: 'Slovensko', countryCode: 'SK', lat: 48.21, lng: 19.35 },
    { slug: 'zvolen', name: 'Zvolen', country: 'Slovensko', countryCode: 'SK', lat: 48.57, lng: 19.13 },
    { slug: 'zarnovica', name: 'Žarnovica', country: 'Slovensko', countryCode: 'SK', lat: 48.49, lng: 18.72 },
    { slug: 'ziar-nad-hronom', name: 'Žiar nad Hronom', country: 'Slovensko', countryCode: 'SK', lat: 48.59, lng: 18.85 },
    // Prešovský kraj
    { slug: 'presov', name: 'Prešov', country: 'Slovensko', countryCode: 'SK', lat: 48.99, lng: 21.24 },
    { slug: 'bardejov', name: 'Bardejov', country: 'Slovensko', countryCode: 'SK', lat: 49.29, lng: 21.28 },
    { slug: 'humenne', name: 'Humenné', country: 'Slovensko', countryCode: 'SK', lat: 48.94, lng: 21.91 },
    { slug: 'kezmarok', name: 'Kežmarok', country: 'Slovensko', countryCode: 'SK', lat: 49.14, lng: 20.43 },
    { slug: 'levoca', name: 'Levoča', country: 'Slovensko', countryCode: 'SK', lat: 49.02, lng: 20.59 },
    { slug: 'medzilaborce', name: 'Medzilaborce', country: 'Slovensko', countryCode: 'SK', lat: 49.27, lng: 21.91 },
    { slug: 'poprad', name: 'Poprad', country: 'Slovensko', countryCode: 'SK', lat: 49.06, lng: 20.30 },
    { slug: 'sabinov', name: 'Sabinov', country: 'Slovensko', countryCode: 'SK', lat: 49.10, lng: 21.10 },
    { slug: 'snina', name: 'Snina', country: 'Slovensko', countryCode: 'SK', lat: 48.99, lng: 22.15 },
    { slug: 'stara-lubovna', name: 'Stará Ľubovňa', country: 'Slovensko', countryCode: 'SK', lat: 49.30, lng: 20.69 },
    { slug: 'stropkov', name: 'Stropkov', country: 'Slovensko', countryCode: 'SK', lat: 49.20, lng: 21.65 },
    { slug: 'svidnik', name: 'Svidník', country: 'Slovensko', countryCode: 'SK', lat: 49.31, lng: 21.57 },
    { slug: 'vranov-nad-toplou', name: 'Vranov nad Topľou', country: 'Slovensko', countryCode: 'SK', lat: 48.88, lng: 21.69 },
    // Košický kraj
    { slug: 'kosice', name: 'Košice', country: 'Slovensko', countryCode: 'SK', lat: 48.72, lng: 21.26 },
    { slug: 'gelnica', name: 'Gelnica', country: 'Slovensko', countryCode: 'SK', lat: 48.86, lng: 20.94 },
    { slug: 'michalovce', name: 'Michalovce', country: 'Slovensko', countryCode: 'SK', lat: 48.76, lng: 21.92 },
    { slug: 'roznava', name: 'Rožňava', country: 'Slovensko', countryCode: 'SK', lat: 48.66, lng: 20.53 },
    { slug: 'sobrance', name: 'Sobrance', country: 'Slovensko', countryCode: 'SK', lat: 48.75, lng: 22.18 },
    { slug: 'spisska-nova-ves', name: 'Spišská Nová Ves', country: 'Slovensko', countryCode: 'SK', lat: 48.95, lng: 20.57 },
    { slug: 'trebisov', name: 'Trebišov', country: 'Slovensko', countryCode: 'SK', ...TREBISOV_PHONE, lat: 48.63, lng: 21.72 },
    { slug: 'kralovsky-chlmec', name: 'Kráľovský Chlmec', country: 'Slovensko', countryCode: 'SK', ...TREBISOV_PHONE, lat: 48.42, lng: 21.98 },
    { slug: 'secovce', name: 'Sečovce', country: 'Slovensko', countryCode: 'SK', ...TREBISOV_PHONE, lat: 48.70, lng: 21.67 },
    { slug: 'bysta', name: 'Byšta', country: 'Slovensko', countryCode: 'SK', ...TREBISOV_PHONE, lat: 48.58, lng: 21.73 },
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
    { slug: 'usti-nad-labem', name: 'Ústí nad Labem', country: 'Česko', countryCode: 'CZ', lat: 50.66, lng: 14.04 },
    { slug: 'karlovy-vary', name: 'Karlovy Vary', country: 'Česko', countryCode: 'CZ', lat: 50.23, lng: 12.87 },
    { slug: 'jihlava', name: 'Jihlava', country: 'Česko', countryCode: 'CZ', lat: 49.40, lng: 15.59 },
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
    { slug: 'szekesfehervar', name: 'Székesfehérvár', country: 'Magyarország', countryCode: 'HU', lat: 47.19, lng: 18.41 },
    { slug: 'szombathely', name: 'Szombathely', country: 'Magyarország', countryCode: 'HU', lat: 47.23, lng: 16.62 },
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
    { slug: 'lublin', name: 'Lublin', country: 'Polska', countryCode: 'PL', lat: 51.25, lng: 22.57 },
    { slug: 'bialystok', name: 'Białystok', country: 'Polska', countryCode: 'PL', lat: 53.13, lng: 23.16 },
  ],
  de: [
    { slug: 'wien', name: 'Wien', country: 'Österreich', countryCode: 'AT', lat: 48.21, lng: 16.37 },
    { slug: 'graz', name: 'Graz', country: 'Österreich', countryCode: 'AT', lat: 47.07, lng: 15.44 },
    { slug: 'linz', name: 'Linz', country: 'Österreich', countryCode: 'AT', lat: 48.31, lng: 14.29 },
    { slug: 'salzburg', name: 'Salzburg', country: 'Österreich', countryCode: 'AT', lat: 47.80, lng: 13.04 },
    { slug: 'innsbruck', name: 'Innsbruck', country: 'Österreich', countryCode: 'AT', lat: 47.26, lng: 11.39 },
    { slug: 'klagenfurt', name: 'Klagenfurt', country: 'Österreich', countryCode: 'AT', lat: 46.62, lng: 14.31 },
  ],
};

export function getCitiesForLang(lang: string): City[] {
  return CITIES[lang] ?? [];
}

export function getAllCities(): City[] {
  return Object.values(CITIES).flat();
}

export function findCity(lang: string, slug: string): City | undefined {
  return getCitiesForLang(lang).find(c => c.slug === slug);
}
