// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://foxi.taxi',
  trailingSlash: 'always',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
