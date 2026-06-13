import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProduct, listProducts, listCategories } from "@/server/repo";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductJsonLd } from "@/components/seo/json-ld";

// Catalogue is dynamic (admin-editable), so render product pages on demand.
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };

  const cover = product.images[0]?.url;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: cover ? [{ url: cover, width: 1200, height: 1200 }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [all, categories] = await Promise.all([listProducts(), listCategories()]);
  const category = categories.find((c) => c.slug === product.category);
  const related = Array.from(
    new Map(
      all
        .filter((p) => p.category === product.category)
        .concat(all)
        .filter((p) => p.id !== product.id)
        .map((p) => [p.id, p]),
    ).values(),
  ).slice(0, 4);

  return (
    <div className="container pt-[calc(var(--nav-height)+1.5rem)]">
      <ProductJsonLd product={product} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-brand">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category ? (
          <Link
            href={`/shop?category=${category.slug}`}
            className="hover:text-brand"
          >
            {category.name}
          </Link>
        ) : null}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <ProductDetail product={product} />
      </div>

      {/* Related */}
      <section className="section">
        <SectionHeading eyebrow="You may also like" title="Related products" />
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
