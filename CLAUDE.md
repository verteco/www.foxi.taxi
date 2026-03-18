# CLAUDE.md — FOXI TAXI (foxi.taxi)

## Project Overview

**foxi.taxi** is a promotional/SEO website for FOXI TAXI — a taxi dispatch platform that connects local taxi operators with customers. Each city/region can have its own operator with dedicated phone numbers. The site detects visitor's geolocation and shows the relevant local number.

## Tech Stack

- **Framework**: Astro 6 (static site generation)
- **Server**: Custom Node.js server (`server.mjs`) for DO App Platform
- **Styling**: Vanilla CSS (no Tailwind), brand-aligned with foxi.food
- **i18n**: Custom TypeScript-based translations (6 languages)
- **Deployment**: DigitalOcean App Platform (auto-deploy from GitHub main)
- **Domain**: foxi.taxi (registered via Openprovider, NS on Cloudflare)
- **Repo**: https://github.com/verteco/www.foxi.taxi

## Brand Identity (shared with foxi.food / foxifood.com)

- **Primary**: `#5a57a5` (purple)
- **Accent**: `#f37722` (orange)
- **Font**: Outfit (Google Fonts)
- **Logo**: Shared FOXI logo assets in `/public/images/`
- **Mascot**: Foxi fox character (`foxi-mascot.png`)

## Commands

```bash
npm run dev      # Dev server on localhost:4321
npm run build    # Static build → ./dist (120+ pages)
node server.mjs  # Production server on :8080 (serves ./dist)
```

## Architecture

```
src/
  data/
    cities.ts       # All cities per country (SK=79 districts, CZ=13, HU=10, PL=10, AT=6)
    regions.ts      # Country-level config (phone, flag, currency, operator)
  i18n/
    translations.ts # All translations (EN/SK/CS/DE/HU/PL)
  components/
    HomePage.astro  # Shared page template (hero, features, CTA, footer)
  layouts/
    Layout.astro    # HTML head, meta tags, Schema.org
  pages/
    index.astro     # Root — browser language detection → redirect
    [lang]/
      index.astro   # Language homepage (e.g. /sk/, /cs/)
      [city]/
        index.astro # City page (e.g. /sk/trebisov/) — getStaticPaths from cities.ts
  styles/
    global.css      # All styles, brand colors, responsive
```

## Geolocation Logic

1. Page loads → hero shows "Detecting location..."
2. Client-side JS calls `ipapi.co/json/` with **2 second timeout**
3. If geo responds → show region-specific phone number + country badge
4. If timeout or error → **fallback to language** (sk→SK, cs→CZ, hu→HU, pl→PL, de→AT)
5. First resolver wins (race-safe, no flicker)

## Cities & Regions

### Active (with phone numbers)
- **Trebišov area** (SK): 0950 706 000 / 0950 795 150, operator "RS Dolina"
  - Cities: Trebišov, Kráľovský Chlmec, Sečovce, Byšta

### Coming Soon (placeholder)
- All other SK district cities (79 total)
- CZ: Praha, Brno, Ostrava + 10 more
- HU: Budapest, Debrecen, Szeged + 7 more
- PL: Warszawa, Kraków, Wrocław + 7 more
- AT: Wien, Graz, Linz, Salzburg, Innsbruck, Klagenfurt

## Adding a New City/Operator

1. Edit `src/data/cities.ts` — add entry with `phone`, `phoneDisplay`, `operator`
2. That's it — Astro generates the page automatically via `getStaticPaths()`
3. Push to main → DO auto-deploys

## Adding a New Country/Language

1. Add translations in `src/i18n/translations.ts`
2. Add country to `src/data/regions.ts`
3. Add cities array to `src/data/cities.ts` under the language key
4. Create `src/pages/[newlang]/index.astro` (copy from existing)
5. Update footer language dropdown in `src/components/HomePage.astro`
6. Update root redirect mapping in `src/pages/index.astro`

## Domain & DNS

- **Registrar**: Openprovider (ID: 29090810)
- **Owner**: Norman Bystrican / Verteco, s.r.o. (NB936983-SK)
- **NS**: michelle.ns.cloudflare.com, patrick.ns.cloudflare.com
- **DNSSEC**: Disabled (required for Cloudflare)
- **Auth code**: h9%AC$#0laV9
- **Autorenew**: ON
- **Expiry**: 2027-03-18

## Deployment (DO App Platform)

- **Build command**: `npm run build`
- **Run command**: `node server.mjs` (via Procfile)
- **HTTP port**: 8080
- **Output**: Static files served from `./dist`
- **Cache**: 1 year for assets, 10 min for HTML

## SEO

- Schema.org `TaxiService` structured data per page
- Open Graph + Twitter meta tags
- Canonical URLs
- Per-city meta titles: "FOXI TAXI Trebišov — ..."
- 120+ static pages = 120+ indexable URLs

## Key Rules

- **No operator/owner info on the site** — only phone numbers and FOXI TAXI branding
- **Phone numbers come from `cities.ts`** — not hardcoded in templates
- **Each country will have its own operator** — different phone numbers per city
- **Geolocation determines region badge** (country flag), **language determines UI language**
- **Cities without a phone number show "Coming soon"** — no fake numbers
