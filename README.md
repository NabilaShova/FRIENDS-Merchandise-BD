# FRIENDS Merchandise BD

> **For the Ones Who Never Miss an Episode.**  
> Premium ecommerce for official FRIENDS merchandise in Bangladesh.

**Repo:** [github.com/NabilaShova/FRIENDS-Merchandise-BD](https://github.com/NabilaShova/FRIENDS-Merchandise-BD)

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-ff0080) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## ✨ What's built

Full-stack store with **shared admin + customer data** — products, categories, coupons, orders, and payment settings all live in one backend.

- **Storefront** — animated homepage, shop (filters/sort), product detail (variants, gallery), cart drawer, checkout (COD + bKash), customer account (orders, wishlist, addresses, rewards)
- **Admin panel** (`/admin`) — dashboard, products, categories, coupons, orders, analytics, bKash payment instructions
- **Backend** — REST APIs + Prisma/Postgres (Neon) with in-memory fallback for local dev without a database
- **Design system** — FRIENDS purple/yellow tokens, glassmorphism, Framer Motion, dark mode, mobile bottom nav
- **SEO** — metadata, Open Graph, JSON-LD, sitemap, robots.txt
- **Docker + Render** — optional alternative deploy via [`render.yaml`](./render.yaml)

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
| Data/DB     | **Neon PostgreSQL** + Prisma ORM (auto-switches from in-memory when unset) |
| Payments    | Cash on Delivery + bKash (Send Money, manual TrxID) |
| Deploy      | **Vercel + Neon** (recommended, free) · Docker → Render (optional) |

---

## 📁 Folder structure

```
friends-merchandise-bd/
├── prisma/
│   └── schema.prisma           # Postgres schema (Category, Product, Order…)
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

See [`prisma/schema.prisma`](./prisma/schema.prisma). Models: `Category`, `Product`, `ProductImage`, `ProductVariant`, `Coupon`, `Order`, `Setting` (store-wide payment config).

Seed data: 9 categories, 8 products, 4 coupons — loaded via `npm run db:seed`.

---

## 🔌 API & shared backend

The admin dashboard and the customer storefront share **one server-side source of truth** (`src/server/repo.ts`). Every catalogue read (home, shop, product pages, sitemap) and every admin write (products, categories, coupons, orders, settings) flows through the same store, so an admin change is immediately visible to customers.

**Persistence** (automatic — set `DATABASE_URL` to switch):

| Mode | When | Use case |
| ---- | ---- | -------- |
| **Postgres** | `DATABASE_URL` set | **Production** (Vercel + Neon) |
| **In-memory** | no `DATABASE_URL` | Local dev, quick demo |
| **JSON file** | `DATA_DIR` set, no DB | Render with persistent disk |

**Admin access:** `/admin/login` — gated by middleware + API session cookie. Set `ADMIN_PASSWORD` in env (default demo: `friends-admin`).

**Key endpoints:**

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

---

## 🚀 Getting started

```bash
npm install
cp .env.example .env          # add DATABASE_URL when using Neon
npm run dev                   # http://localhost:3000
```

**With Neon (production database):**

```bash
# Put your Neon connection string in .env as DATABASE_URL=...
npm run db:push               # create tables
npm run db:seed               # load 9 categories, 8 products, 4 coupons
npm run dev
```

> **Windows PowerShell:** if `npm` fails with a script execution error, use `npm.cmd` instead (e.g. `npm.cmd run db:push`).

Verify storage mode: `http://localhost:3000/api/health` → `"storage":"postgres"` when `DATABASE_URL` is set.

**Other scripts:** `npm run build` · `npm run lint` · `npm run typecheck` · `npm run db:studio`

---

## 🗺️ Roadmap (remaining surfaces)

The foundation is intentionally structured so these drop in cleanly:

- [x] **Product page** — gallery, variants, sticky add-to-cart, related products
- [x] **Cart** — slide-over drawer, coupon, gift wrap, cross-sell, est. delivery
- [x] **Checkout** — one-page guest checkout, **Cash on Delivery + bKash (Send Money)** with manual Transaction ID capture
- [x] **Admin panel** — password-gated shell + dashboard + orders (with **status updates**) + **editable bKash payment instructions**
- [x] **Admin — Products** — create/edit/delete, **image uploads (multi-image)**, sizes/colors, feature toggle, stock & pricing
- [x] **Admin — Categories** — create/edit/delete collections with cover-image upload
- [x] **Admin — Coupons** — percent/fixed CRUD, min-spend, active toggle (live-validated by the cart)
- [x] **Admin — Analytics** — revenue (7-day chart), AOV, payment split, order status, top products
- [x] **Account** — overview, orders + tracking, wishlist, addresses (CRUD), profile, rewards tiers
- [x] **Backend** — shared repository with **Postgres (Prisma/Neon) or in-memory fallback**, full REST APIs, seed script, admin auth
- [ ] **Admin (more)** — customers, homepage builder, media library
- [ ] **Admin AI** — generate descriptions, SEO, captions, hashtags, banners
- [ ] **Blog** — SEO posts, categories, related
- [ ] **Search** — instant autocomplete + trending
- [ ] **Extras** — compare, recently viewed, gift cards, referral, live chat, WhatsApp/Messenger
- [ ] **Testing** — Vitest (unit) + Playwright (e2e) + Lighthouse CI

---

## 📈 Performance & accessibility

Targets: **100 Performance / 100 Accessibility / 100 SEO**. Foundations in place: static generation, `next/image` (AVIF/WebP), font `display: swap`, package import optimisation, semantic landmarks, focus-visible rings, reduced-motion support, and meta/JSON-LD/sitemap/robots.

---

## 🚀 Deploy (Neon + Vercel) — recommended, free

### 1. Neon database

1. [neon.tech](https://neon.tech) → **New Project** (region: `ap-southeast-1` for Bangladesh).
2. Copy the **connection string**.
3. Locally, create `.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASS@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   ```
4. Seed the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```
   On Windows PowerShell use `npm.cmd run db:push` if `npm` is blocked.

### 2. Vercel project

1. Push this repo to GitHub: [NabilaShova/FRIENDS-Merchandise-BD](https://github.com/NabilaShova/FRIENDS-Merchandise-BD).
2. [vercel.com/new](https://vercel.com/new) → **Import** the GitHub repo → **Deploy**.
3. After first deploy, go to **Project → Settings → Environment Variables** and add (Production + Preview):

   | Key | Value |
   | --- | ----- |
   | `DATABASE_URL` | your Neon connection string |
   | `ADMIN_PASSWORD` | a strong admin password |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` |

4. **Redeploy** (Deployments → ⋯ → Redeploy).

### 3. Verify

| URL | Expected |
| --- | -------- |
| `/api/health` | `"storage":"postgres"` |
| `/shop` | 8 products |
| `/admin/login` | admin dashboard login |

> **Vercel requires `DATABASE_URL`** — serverless functions don't share in-memory state. The build runs `prisma generate && next build` automatically. At higher traffic, use Neon's **pooled** connection string (host contains `-pooler`).

---

## 🐳 Alternative: Docker + Render

[`render.yaml`](./render.yaml) deploys one Docker service (storefront + admin).

```bash
docker build -t friends-merch .
docker run -p 3000:10000 -e ADMIN_PASSWORD=your-secret -e DATABASE_URL=your-neon-url friends-merch
```

On Render: **New + → Blueprint** → set `ADMIN_PASSWORD`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`. Free tier spins down after 15 min idle.

| Setup | Cost | Best for |
| ----- | ---- | -------- |
| **Neon + Vercel** ⭐ | $0 | Launch, low traffic |
| Render Docker + Neon | ~$7/mo | Always-on single container |
| Render + persistent disk (`DATA_DIR`) | ~$8/mo | No external DB (JSON file store) |

---

> _Fan-made tribute store. FRIENDS and related marks are property of Warner Bros. Replace placeholder imagery and licensing before commercial use._
