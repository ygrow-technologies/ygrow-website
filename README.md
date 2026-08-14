# YGrow marketing site

A responsive React and Tailwind landing page for YGrow, built around the brand direction in `reference/design.png` and the content strategy in `reference/REFER.md`.

## Run locally

```bash
npm install
npm run dev
```

The site opens at `http://127.0.0.1:3000`. After building, `npm run preview`
uses the same address.

Create a production bundle with `npm run build`.

## Waitlist storage

The early-access forms work immediately in demo mode by storing submissions in the visitor's browser. To collect real submissions:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in its SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Restart the development server.

The included row-level-security policy permits anonymous inserts only. Reading the waitlist still requires authenticated dashboard/server access.

## Before launch

Replace the placeholder `ygrow.com` email addresses and legal links with the company's live destinations. The main content, responsive states, accessibility labels, and waitlist validation are production-ready.
