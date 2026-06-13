/**
 * Seed script: loads the starter catalogue into Postgres.
 * Run with: npm run db:seed  (requires DATABASE_URL).
 */
import { PrismaClient } from "@prisma/client";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { DEFAULT_COUPONS } from "../src/lib/coupons";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding FRIENDS Merchandise BD…");

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image },
      create: {
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
      },
    });
  }
  console.log(`✓ ${categories.length} categories`);

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stock: p.stock,
        description: p.description,
        isFeatured: p.isFeatured ?? false,
        categorySlug: p.category,
      },
      create: {
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured ?? false,
        tags: p.tags,
        attributes: p.attributes ?? undefined,
        categorySlug: p.category,
        images: {
          create: p.images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            position: i,
          })),
        },
        variants: {
          create: (p.variants ?? []).map((v) => ({
            name: v.name,
            value: v.value,
            hex: v.hex ?? null,
            inStock: v.inStock,
          })),
        },
      },
    });
  }
  console.log(`✓ ${products.length} products`);

  for (const c of DEFAULT_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: { kind: c.kind, value: c.value, minSpend: c.minSpend, active: c.active },
      create: {
        code: c.code,
        kind: c.kind,
        value: c.value,
        minSpend: c.minSpend,
        active: c.active,
      },
    });
  }
  console.log(`✓ ${DEFAULT_COUPONS.length} coupons`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
