import { siteConfig } from "@/lib/site";
import type { Product } from "@/lib/types";

/** Render a JSON-LD <script> block. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, structured data — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "OnlineStore",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        slogan: siteConfig.tagline,
        sameAs: [siteConfig.links.instagram, siteConfig.links.facebook],
        contactPoint: {
          "@type": "ContactPoint",
          email: siteConfig.contact.email,
          telephone: siteConfig.contact.phone,
          contactType: "customer service",
          areaServed: "BD",
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images.map((i) => i.url),
        description: product.description,
        sku: product.sku,
        brand: { "@type": "Brand", name: siteConfig.name },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "BDT",
          price: product.price,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${siteConfig.url}/product/${product.slug}`,
        },
      }}
    />
  );
}
