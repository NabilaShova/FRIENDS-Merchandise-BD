import { listProducts, listCategories } from "@/server/repo";
import { Hero } from "@/components/home/hero";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { TrendingCollections } from "@/components/home/trending-collections";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ShopByMood } from "@/components/home/shop-by-mood";
import { WhyShop } from "@/components/home/why-shop";
import { SocialFeed } from "@/components/home/social-feed";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

// Read from shared server state on every request so admin changes show instantly.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);
  const featured = products.filter((p) => p.isFeatured);

  return (
    <>
      <Hero />
      <BrandMarquee />
      <TrendingCollections categories={categories} />
      <FeaturedProducts products={featured.length ? featured : products.slice(0, 8)} />
      <ShopByMood />
      <WhyShop />
      <SocialFeed />
      <Testimonials />
      <Newsletter />
    </>
  );
}
