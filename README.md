# YGrow marketing site

A responsive React and Tailwind landing page for YGrow, built around the brand direction in `reference/design.png` and the content strategy in `reference/REFER.md`.

## Run locally

```bash
npm install
npm run dev
```

The site opens at `http://127.0.0.1:3001`. After building, `npm run preview`
uses the same address.

Create a production bundle with `npm run build`.

## Waitlist storage

The early-access form uses Supabase. To collect submissions:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in its SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Restart the development server.

The included row-level-security policy permits anonymous inserts only. Reading the waitlist still requires authenticated dashboard/server access.

## Google Tag Manager

Set `VITE_GTM_ID` in `.env.local` to a valid web container ID such as `GTM-XXXXXXX`. The production build then injects the official script in `<head>` and the no-script fallback immediately after `<body>`. If the variable is absent or invalid, no GTM network request is emitted.

The app sends privacy-safe data-layer events for:

- `cta_click`
- `faq_toggle`
- `waitlist_submit`
- `contact_submit`
- `generate_lead`
- `contact_link_click`
- `social_click`

Names, email addresses, and message text are deliberately excluded. Before enabling marketing or analytics tags in production, configure a consent-management platform and consent mode in the GTM container for the regions where they are required.

## Search metadata

Canonical, Open Graph, Twitter, JSON-LD, robots, sitemap, and web-manifest metadata are configured for `https://ygrow.org/`. If the launch domain changes, update `index.html`, `public/robots.txt`, and `public/sitemap.xml` before deployment, then submit the sitemap in Google Search Console.

## Before launch

Confirm the social URLs, legal destinations, production domain, GTM consent configuration, and contact email before launch.
