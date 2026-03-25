// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// Load country data for sitemap filtering
const countriesDir = './src/data/countries';
const countryFiles = ['sk', 'cz', 'hu', 'pl', 'ro', 'de'];
const countries = countryFiles.map(lang => {
  try {
    return JSON.parse(readFileSync(`${countriesDir}/${lang}.json`, 'utf8'));
  } catch { return null; }
}).filter(Boolean);

// Build indexable city slugs from JSON data
const indexableSlugs = new Set();
const indexableLangHomepages = new Set();
for (const country of countries) {
  if (!country.indexable) continue;
  indexableLangHomepages.add(country.lang);
  const allowedRegions = country.indexableRegions ?? [];
  for (const city of country.cities) {
    if (allowedRegions.length === 0 || allowedRegions.includes(city.region)) {
      indexableSlugs.add(`/${country.lang}/${city.slug}/`);
    }
  }
}

export default defineConfig({
  site: 'https://www.foxi.taxi',
  trailingSlash: 'always',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const path = url.pathname;

        // Allow indexable language homepages
        for (const lang of indexableLangHomepages) {
          if (path === `/${lang}/`) return true;
        }

        // Allow indexable city pages
        if (indexableSlugs.has(path)) return true;

        return false;
      },
    }),
  ],
});
