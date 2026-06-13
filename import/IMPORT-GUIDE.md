# Importing your real catalog

Facebook pages can't be read automatically (they require login), so we use a simple
drop-in workflow. Once you complete these 3 steps, run one command and your real
products replace the demo ones across the whole site.

## Step 1 — Add your logo

Save your logo from the Facebook page as **`public/brand/logo.png`**
(a transparent PNG works best; ~160×40 or larger).

> Tell me once it's added and I'll flip the site to use it (set `logoSrc` in `src/lib/site.ts`).
> Until then the animated wordmark is shown.

## Step 2 — Add product photos

Save each product photo into **`public/products/`**.
Use simple, lowercase file names, e.g.:

```
public/products/central-perk-tee-1.jpg
public/products/central-perk-tee-2.jpg
public/products/how-you-doin-hoodie-1.jpg
```

A product can have multiple photos.

## Step 3 — Fill in `import/products.csv`

One row per product. Columns:

| Column         | Required | Example                              | Notes |
| -------------- | -------- | ------------------------------------ | ----- |
| `name`         | ✅       | `Central Perk Classic Tee`           | Product title |
| `category`     | ✅       | `t-shirts`                           | One of the valid slugs below |
| `price`        | ✅       | `850`                                | In BDT, numbers only |
| `comparePrice` |          | `1200`                               | Original price (for a strike-through). Leave blank if none |
| `stock`        | ✅       | `40`                                 | Units in stock |
| `description`  | ✅       | `Soft premium cotton tee…`           | Wrap in quotes if it has commas |
| `images`       | ✅       | `central-perk-tee-1.jpg\|tee-2.jpg`  | File names from `public/products/`, separated by `\|` |
| `sizes`        |          | `S\|M\|L\|XL`                        | Separated by `\|`. Leave blank for non-apparel |
| `colors`       |          | `Black:#111111\|White:#ffffff`       | `Name:#hex`, separated by `\|`. Hex optional |
| `featured`     |          | `yes`                                | `yes` to show on the homepage |
| `badges`       |          | `bestseller`                         | Any of: `new`, `bestseller`, `limited`, `sale` |

**Valid categories:** `t-shirts`, `hoodies`, `mugs`, `wallets`, `caps`, `keychains`, `masks`, `stickers`, `phone-cases`

> The file already contains 3 example rows — delete them and add your own.

## Step 4 — Run the import

```bash
npm run import:products
```

This regenerates `src/data/products.ts` with **only your products** (the demo
catalogue is replaced). It also warns about any image that's missing or any
unknown category. Then run `npm run dev` to see them live.
