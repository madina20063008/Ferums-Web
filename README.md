# FERUMS — Industrial Engineering Website

A **Next.js 16 (App Router)** rebuild of the FERUMS design brief, with a
config-driven **Admin Panel (CMS)** and a **REST backend** (JWT auth, CRUD,
file upload, Prisma DB). Bilingual **EN / RU** with locale-in-path routing and
first-class SEO.

## Stack

- **Next.js 16** App Router + TypeScript + Tailwind v4
- **Prisma** — SQLite locally, PostgreSQL on Vercel (`vercel-build` swaps the provider)
- **jose** JWT sessions (httpOnly cookie) + **bcryptjs** — no third-party auth
- Fonts: Geist + IBM Plex Mono · accent `#1CAFE8`

## SEO (the priority)

- Server-rendered pages (SSG) — every page prerenders static HTML in both locales
- Locale-in-path routing `/en/...` `/ru/...` with `<html lang>` per locale
- `hreflang` alternates (en / ru / x-default) + canonical on every page
- Open Graph + Twitter cards, per-page `generateMetadata`
- JSON-LD: Organization (site-wide), Product (product pages), NewsArticle (news)
- `sitemap.xml` (with `xhtml:link` alternates) + `robots.txt`
- Admin (`/admin`) and API are `noindex` / disallowed

## Getting started

```bash
npm install
npm run db:push     # create the SQLite schema
npm run db:seed     # seed admin user + all content from the design
npm run dev         # http://localhost:3000  (redirects to /en)
```

Admin panel: **/admin** — default login **ats@ats-systems.net** / **ats-c89475630a**
(override via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`).

## Structure

```
src/
  app/
    (site)/[locale]/     # public bilingual site (home, products, projects, news,
                         #   industries, services, careers, about, sustainability,
                         #   ferums-digital, contact) + [slug] detail pages
    (admin)/admin/       # config-driven CMS (its own <html>, always noindex)
    api/                 # REST route handlers (auth, CRUD, upload, settings)
    sitemap.ts robots.ts
  components/site/        # Sidebar, Footer, ContactForm, ui, SEO helpers
  components/admin/       # AdminChrome, ResourceList, ResourceForm, SettingsEditor
  lib/                    # db, auth, api, crud, schemas, i18n, seo, site-data,
                          #   admin/resources (resource config), seed-*
prisma/schema.prisma      # Product, Project, Article, CareerRole, Industry,
                          #   Service, ContactSubmission, User, Setting, MediaAsset
```

## Content model

List content (products, projects, news, careers, industries, services) is managed
in the admin CRUD. Static page copy (hero, about, sustainability, contact,
ferums-digital, nav, footer, SEO defaults) lives in the `site` Setting as bilingual
JSON, editable under **Admin → Site settings**. All initial content is seeded from
the original design in `src/lib/seed-data.ts`.

## Deploy (Vercel)

Set `DATABASE_URL` (Postgres, e.g. Neon), `JWT_SECRET`, and optionally
`NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. The `vercel-build` script
rewrites the Prisma provider to `postgresql`, pushes the schema, and builds.
