import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

/** Storefront chrome: navbar, footer, and mobile bottom nav. */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <Navbar />
      <main className="min-h-screen pb-24 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
