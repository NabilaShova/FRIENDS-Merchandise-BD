# FRIENDS Merchandise BD

> **For the Ones Who Never Miss an Episode.**
> A premium, production-grade ecommerce experience for official FRIENDS merchandise in Bangladesh — built to feel like Apple × The Souled Store × Nothing × Nike × Netflix.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-ff0080)

---

## ✨ What's built right now

This repository is a **runnable foundation** with a fully-realised, animated homepage and a reusable design system. It compiles cleanly (`next build` → all routes static) and is ready to extend.

- **Design system** — FRIENDS purple + yellow tokens, light/dark theme, glassmorphism, soft shadows, premium type (Plus Jakarta Sans + Inter), motion presets.
- **Animated homepage** — every section requested:
  1. Parallax hero with floating products + scroll cue
  2. Infinite quote marquee
  3. Trending collections (bento grid, image zoom)
  4. Featured products (snap slider, hover lift, quick actions)
  5. Shop by Mood (gradient cards)
  6. Why Shop With Us (animated icons)
  7. Social feed (dual auto-scroll carousels)
  8. Animated testimonials (glass cards, auto-rotate)
  9. Newsletter (brand CTA)
- **Shop page** — category filters, sort, grid/list toggle.
- **Layout** — sticky glass navbar (transparent→glass on scroll), dark-mode toggle, mobile drawer, thumb-friendly bottom nav, footer.
- **SEO** — metadata, Open Graph, Twitter cards, JSON-LD (Organization + Product), `sitemap.xml`, `robots.txt`.
- **Reusable components** — `Button`, `Badge`, `Rating`, `Skeleton`, `Marquee`, `SectionHeading`, `ProductCard`.

---

## 🧱 Tech stack

| Layer       | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 15 (App Router, RSC, SSG/SSR/Edge)          |
| Language    | TypeScript (strict, `noUncheckedIndexedAccess`)     |
| Styling     | Tailwind CSS 3.4 + CSS variable theming             |
| Animation   | Framer Motion 11                                    |
| Icons       | lucide-react                                        |
| Theming     | next-themes (class strategy)                        |
| Data/DB     | Supabase (PostgreSQL) + Prisma ORM                  |
| Media       | Cloudinary                                          |
| Auth        | NextAuth                                            |
| Payments    | Cash on Delivery + bKash (Send Money, manual TrxID) |
| Server data | React Query (client) + RSC (server)                 |
| Deploy      | Docker → Render (Blueprint included) · Vercel-ready |

---

## 📁 Folder structure

```
friends-merchandise-bd/
├── prisma/
│   └── schema.prisma           # Full DB schema (User, Product, Order, CMS…)
├── src/
│   ├── app/                    # App Router routes
│   │   ├── layout.tsx          # Root layout: fonts, providers, nav/footer, SEO
│   │   ├── page.tsx            # Homepage (composes home sections)
│   │   ├── globals.css         # Theme tokens + base + component layers
│   │   ├── shop/page.tsx       # Shop (filters, sort, grid/list)
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   ├── robots.ts           # robots.txt
│   │   └── not-found.tsx       # Themed 404
│   ├── components/
│   │   ├── ui/                 # Primitives: button, badge, rating, marquee…
│   │   ├── layout/             # navbar, footer, mobile-bottom-nav
│   │   ├── home/               # Homepage sections (hero, testimonials…)
│   │   ├── product/            # product-card
│   │   ├── shop/               # shop-view
│   │   ├── seo/                # json-ld
│   │   ├── providers.tsx       # Theme (+ future React Query) provider
│   │   ├── theme-toggle.tsx
│   │   └── logo.tsx
│   ├── data/                   # Seed catalogue (loaded into the shared store)
│   ├── server/                 # Shared server repository + admin auth
│   ├── lib/                    # utils, motion, types, prisma client, coupons
│   ├── middleware.ts           # Admin route gate (/admin/* → /admin/login)
│   └── ...
├── prisma/seed.ts              # Seeds categories, products & coupons
├── tailwind.config.ts          # Design tokens & keyframes
├── next.config.mjs             # Image domains, package optimisation
└── .env.example                # All required env vars
```

> Future feature surfaces slot in as route groups: `app/(shop)/product/[slug]`, `app/(account)/account/*`, `app/(admin)/admin/*`, `app/(checkout)/checkout`, `app/api/*`.

---

## 🎨 Design system

Tokens live as raw HSL channels in `globals.css` and are exposed through `tailwind.config.ts`, so `bg-brand`, `text-accent`, opacity modifiers (`bg-brand/20`), and dark mode all work automatically.

| Token            | Light      | Role                       |
| ---------------- | ---------- | -------------------------- |
| `--background`   | `#FFFFFF`  | Page background            |
| `--muted`        | `#FAFAFA`-ish | Section bands           |
| `--brand`        | FRIENDS Purple | Primary / buttons      |
| `--accent`       | FRIENDS Yellow | Dots, highlights       |
| `--foreground`   | near-black | Text / secondary           |

Reusable utilities: `.glass`, `.section`, `.heading-display`, `.skeleton`, `.mask-fade-x`. Motion presets in `src/lib/motion.ts` (`fadeInUp`, `scaleIn`, `staggerContainer`, `easeOutExpo`).

---

## 🗄️ Database schema

See [`prisma/schema.prisma`](./prisma/schema.prisma). Core models: `User`, `Address`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `Order`, `OrderItem`, `Review`, `Wishlist`, `Coupon`, `BlogPost`, and a generic `CmsBlock` (powers banners, homepage, FAQs, footer).

---

## 🔌 API & shared backend

The admin dashboard and the customer storefront share **one server-side source of truth** (`src/server/repo.ts`). Every catalogue read (home, shop, product pages, sitemap) and every admin write (products, categories, coupons, orders, settings) flows through the same store, so an admin change is immediately visible to customers.

**Persistence:**

- **In-memory (default):** shared across all visitors for the life of the server process — ideal for a single Render container. Seeded from the bundled catalogue; resets on restart/redeploy.
- **Durable (recommended live):** set `DATA_DIR` (e.g. a Render disk at `/var/data`) and the store is saved as JSON there, surviving restarts — zero external database required.

**Endpoints:**

| Endpoint                       | Method            | Access  | Purpose                                  |
| ------------------------------ | ----------------- | ------- | ---------------------------------------- |
| `/api/health`                  | GET               | public  | Readiness probe + storage mode           |
| `/api/products` `/[slug]`      | GET               | public  | List/filter + product detail             |
| `/api/categories`              | GET               | public  | Storefront categories                    |
| `/api/coupons` `/validate`     | GET / POST        | public  | List coupons / validate a code           |
| `/api/settings`                | GET               | public  | Payment methods + bKash instructions     |
| `/api/orders`                  | POST              | public  | Place an order (checkout)                |
| `/api/orders/[number]`         | GET               | public  | Fetch one order (success page / account) |
| `/api/orders`                  | GET               | admin   | Full order list                          |
| `/api/admin/products` `/[id]`  | POST/PUT/DELETE   | admin   | Product CRUD                             |
| `/api/admin/categories`        | POST/PUT/DELETE   | admin   | Category CRUD                            |
| `/api/admin/coupons`           | POST/PUT/DELETE   | admin   | Coupon CRUD                              |
| `/api/admin/orders/[number]`   | PATCH             | admin   | Update fulfilment status                 |
| `/api/admin/settings`          | PUT               | admin   | Update store settings                    |
| `/api/admin/login` `/logout`   | POST              | public  | Admin session cookie                     |

**Admin access** is gated two ways: `src/middleware.ts` redirects any `/admin/*` page without a valid session to `/admin/login`, and every mutating `/api/admin/*` route checks the session via `requireAdmin()` (returns `401` otherwise). Demo password `friends-admin`, override via `ADMIN_PASSWORD`.

> A Prisma schema + seed (`prisma/`) are still included for teams that prefer Postgres; the repo seam in `src/server/repo.ts` is where you'd swap in Prisma queries.

---

## 🚀 Getting started

```bash
# 1. Install deps (done)
npm install

# 2. Configure env
cp .env.example .env.local   # fill in values

# 3. Run
npm run dev      # http://localhost:3000  (no external services required)
npm run build    # production build
npm run lint     # eslint
npm run typecheck

# 4. (Optional) use a real PostgreSQL database
#    Set DATABASE_URL in .env (Neon / Supabase / Render — see below), then:
npm run db:push  # create the tables
npm run db:seed  # load the starter catalogue
```

> No database needed to run. With `DATABASE_URL` unset the shared store is in-memory (set `DATA_DIR` to persist it as JSON). Set `DATABASE_URL` and the **same repository transparently switches to Postgres** — no code changes. `/api/health` reports the active storage mode.

---

## 🗺️ Roadmap (remaining surfaces)

The foundation is intentionally structured so these drop in cleanly:

- [ ] **Product page** — gallery + zoom + 360, variants, sticky add-to-cart, floating buy-now, related products
- [x] **Cart** — slide-over drawer, coupon, gift wrap, cross-sell, est. delivery
- [x] **Product page** — gallery + zoom, variants, sticky add-to-cart, related
- [x] **Checkout** — one-page guest checkout, **Cash on Delivery + bKash (Send Money)** with manual Transaction ID capture
- [x] **Admin panel** — password-gated shell + dashboard + orders (with **status updates**) + **editable bKash payment instructions**
- [x] **Admin — Products** — create/edit/delete, **drag-free image uploads (multi-image)**, sizes/colors, feature toggle, stock & pricing
- [x] **Admin — Categories** — create/edit/delete collections with cover-image upload (storefront keeps the default 9 + any you add)
- [x] **Admin — Coupons** — percent/fixed CRUD, min-spend, active toggle (live-validated by the cart)
- [x] **Admin — Analytics** — revenue (7-day chart), AOV, payment split, order status, top products
- [x] **Account** — overview, orders + tracking, wishlist, addresses (CRUD), profile, rewards tiers
- [x] **Backend** — shared server repository with **dual backend (Postgres via Prisma _or_ in-memory/JSON)**, full REST APIs for products/categories/coupons/orders/settings, seed script, server-side admin auth (middleware + per-route guards)
- [ ] **Admin (more)** — customers, homepage builder, media library
- [ ] **Admin AI** — generate descriptions, SEO, captions, hashtags, banners
- [ ] **Blog** — SEO posts, categories, related
- [ ] **Search** — instant autocomplete + trending
- [ ] **Extras** — compare, recently viewed, gift cards, referral, live chat, WhatsApp/Messenger
- [ ] **Backend (more)** — NextAuth social login, checkout API + payment webhooks, real DB provisioning
- [ ] **Testing** — Vitest (unit) + Playwright (e2e) + Lighthouse CI

---

## 📈 Performance & accessibility

Targets: **100 Performance / 100 Accessibility / 100 SEO**. Foundations in place: static generation, `next/image` (AVIF/WebP), font `display: swap`, package import optimisation, semantic landmarks, focus-visible rings, reduced-motion support, and meta/JSON-LD/sitemap/robots.

---

## 🐳 Docker

The app builds into a self-contained image (Next.js `output: "standalone"`), serving
**both the storefront (`/`) and the admin dashboard (`/admin`)** from one service.

```bash
docker build -t friends-merch .
docker run -p 3000:10000 -e ADMIN_PASSWORD=your-secret friends-merch
# → http://localhost:3000   (admin at /admin/login)
```

The server binds to `0.0.0.0:$PORT` (defaults to `10000`). With `DATABASE_URL`
set, all state lives in Postgres so the container filesystem stays ephemeral
and the app scales horizontally.

## 🚀 Deployment (Render)

A [`render.yaml`](./render.yaml) Blueprint is included — one Docker web service for
the whole app.

1. Push this repo to GitHub/GitLab.
2. In Render: **New + → Blueprint**, pick the repo. It reads `render.yaml`.
3. Set the env vars when prompted:
   - `ADMIN_PASSWORD` — your admin login password
   - `NEXT_PUBLIC_SITE_URL` — your `https://<service>.onrender.com` URL
4. Deploy. Health check is `/api/health`; admin lives at `/admin/login`.

> **Free plan note:** Render free web services spin down after 15 min of inactivity
> (first request after is slow). For an always-on store use the $7/mo instance.

### Alternative: Vercel

Push to GitHub, import in Vercel, add env vars from `.env.example`. `next build` is
auto-detected. **On Vercel you must set `DATABASE_URL`** — serverless functions are
isolated, so the in-memory store is not shared between requests there.

---

## 💸 Cost-effective database & hosting options

The repository auto-switches to Postgres the moment `DATABASE_URL` is set, so any
of these work without code changes. Recommended pairings, cheapest first:

| Setup | Database | Hosting | Monthly cost | Notes |
| ----- | -------- | ------- | ------------ | ----- |
| **Best free / easiest** ⭐ | **Neon** (serverless Postgres, free 0.5 GB, scales to zero) | **Vercel** (Hobby, free) | **$0** | Best Next.js fit; Neon is the easiest Postgres to create (1 min, just copy the URL). Ideal for launch + low traffic. |
| All-in-one | **Supabase** (free 500 MB Postgres) | **Vercel** / **Render** | **$0** | Supabase also gives you auth + storage later. Use the *direct* connection string (port 5432) for `db push`/seed. |
| Single platform | **Render Postgres** | **Render** Docker web service | **~$0 → $7+** | One dashboard. Free DB expires after 30 days; web service sleeps on free. Always-on ≈ $7 (web) + $6 (DB). |
| Simple paid | **Railway** Postgres + app | Railway | **~$5+** | Usage-based, very smooth DX, deploys from GitHub. |
| No database at all | — (in-memory + Render disk) | **Render** ($7 instance + $1 disk) | **~$8** | Set `DATA_DIR=/var/data` + a disk; data persists as JSON. Single instance only. |

**My recommendation:** **Neon + Vercel** to launch for free, both set up in minutes.
Move to Render's $7 instance (or add a paid Neon tier) only when traffic grows.

**Go-live checklist (any provider):**

1. Create the database, copy its connection string.
2. Locally: put it in `.env` as `DATABASE_URL`, run `npm run db:push && npm run db:seed`.
3. Add `DATABASE_URL` (+ `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`) to the host's env vars.
4. Deploy. `/api/health` should report `"storage":"postgres"`.

### ⭐ Deploy to Neon + Vercel (free, step by step)

**1 — Create the Neon database**

1. Sign up at [neon.tech](https://neon.tech) → **New Project** (pick a region near your buyers).
2. On the project dashboard, copy the **connection string** (looks like
   `postgresql://USER:PASS@ep-xxx.REGION.aws.neon.tech/neondb?sslmode=require`).

**2 — Seed it from your machine**

```bash
# in the project root
echo 'DATABASE_URL="<paste your Neon string>"' > .env
npm run db:push     # creates the tables in Neon
npm run db:seed     # loads the 8 starter products, 9 categories, coupons
```

**3 — Push the repo to GitHub** (if not already): create a repo and `git push`.

**4 — Import on Vercel**

1. [vercel.com](https://vercel.com) → **Add New… → Project** → import your GitHub repo.
   Framework **Next.js** is auto-detected; leave build settings default.
2. Add **Environment Variables** (Production + Preview):
   | Key | Value |
   | --- | ----- |
   | `DATABASE_URL` | your Neon connection string |
   | `ADMIN_PASSWORD` | a strong admin password |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` |
3. **Deploy.** When it finishes, open `/api/health` — it should say
   `"storage":"postgres"`. Admin login is at `/admin/login`.

> The `build` script runs `prisma generate` before `next build`, so Vercel always
> ships a fresh Prisma client. At higher traffic, switch `DATABASE_URL` to Neon's
> **pooled** string (the host with `-pooler`) to conserve connections.

---

> _Fan-made tribute store. FRIENDS and related marks are property of Warner Bros. Replace placeholder imagery and licensing before commercial use._
