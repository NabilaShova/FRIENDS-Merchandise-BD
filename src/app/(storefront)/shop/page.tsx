import type { Metadata } from "next";
import { listProducts, listCategories } from "@/server/repo";
import { ShopView } from "@/components/shop/shop-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full FRIENDS Merchandise BD catalogue — t-shirts, hoodies, mugs, caps and more.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);
  return (
    <div className="container pt-[calc(var(--nav-height)+2rem)]">
      <header className="mb-8">
        <h1 className="heading-display text-3xl md:text-4xl">Shop All</h1>
        <p className="mt-2 text-muted-foreground">
          {products.length} products · official FRIENDS merchandise
        </p>
      </header>
      <ShopView products={products} categories={categories} />
    </div>
  );
}
