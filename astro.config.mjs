// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
        // Only index SK eastern region cities + SK homepage
        // Košický kraj + Prešovský kraj slugs
        const indexableSlugPrefixes = [
          '/sk/',  // SK homepage
        ];
        const indexableCitySlugs = [
          // Košický kraj
          'kosice', 'gelnica', 'michalovce', 'roznava', 'sobrance',
          'spisska-nova-ves', 'trebisov', 'kralovsky-chlmec', 'secovce', 'bysta',
          // Prešovský kraj
          'presov', 'bardejov', 'humenne', 'kezmarok', 'levoca',
          'medzilaborce', 'poprad', 'sabinov', 'snina', 'stara-lubovna',
          'stropkov', 'svidnik', 'vranov-nad-toplou',
        ];

        // Allow SK homepage
        if (page === 'https://foxi.taxi/sk/') return true;

        // Allow SK city pages from eastern regions
        const match = page.match(/\/sk\/([^/]+)\//);
        if (match && indexableCitySlugs.includes(match[1])) return true;

        // Block everything else from sitemap
        return false;
      },
    }),
  ],
});
