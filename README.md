# Dr. Ahmed Abouseif — Personal Website

موقع رسمي للدكتور أحمد أبو سيف (رئيس أكاديمية الأئمة الأمريكية).

A bilingual (Arabic/English) personal website for Dr. Ahmed Abouseif — Islamic scholar and President of the American Imams Academy.

## Features

- **Bilingual** — Arabic (RTL) and English (LTR) with automatic locale detection
- **YouTube integration** — auto-pulls latest videos from the channel
- **Fast & SEO-friendly** — built with Next.js 14, deploys to Vercel
- **No build steps needed** — Vercel auto-builds on every push
- **Free hosting** — Vercel free tier handles personal sites easily

## Pages

- `/` — Homepage (hero, stats, latest videos, CTA)
- `/about` — Biography
- `/lectures` — Lecture library (synced with YouTube)
- `/articles` — Articles/blog (placeholder, add markdown files later)
- `/events` — Upcoming lectures and events
- `/contact` — Contact info and social media

## Customization (no coding required)

Most changes happen in **two files**:

1. **`lib/site-config.ts`** — change name, stats, social media, email, etc.
2. **`i18n/messages/ar.json`** and **`i18n/messages/en.json`** — change all visible text

To replace placeholder photo: replace the placeholder block in `components/Hero.tsx` (line ~50) with an `<img src="/dr-ahmed.jpg" />` after putting your photo in the `public/` folder.

## Run locally (one-time setup)

```bash
npm install
npm run dev
```

Open <http://localhost:3000>

## Deploy to Vercel (free, takes 5 minutes)

1. Create a free account at <https://vercel.com> (sign in with GitHub)
2. Push this folder to a GitHub repo
3. In Vercel: "Add New Project" → import the repo → click Deploy
4. Done. Your site is live at `your-project.vercel.app`
5. To use a custom domain (e.g. `drahmedabouseif.com`):
   - Buy domain (recommend Cloudflare Registrar — at-cost pricing)
   - In Vercel project → Settings → Domains → add domain
   - Follow DNS instructions

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- next-intl (i18n)
- YouTube RSS feed (no API key needed)
- Hosted on Vercel
