// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://foxi.taxi',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
