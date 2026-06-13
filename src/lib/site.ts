/** Central site configuration: nav, metadata, socials. */

export const siteConfig = {
  name: "FRIENDS Merchandise BD",
  shortName: "FRIENDS Merch",
  tagline: "For the Ones Who Never Miss an Episode.",
  description:
    "Premium official FRIENDS merchandise in Bangladesh — t-shirts, hoodies, mugs, and collectibles for every fan. Could this BE your new favorite store?",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_BD",
  ogImage: "/og.png",
  /**
   * Brand logo image. Drop your file at `public/brand/logo.png` and set this to
   * "/brand/logo.png" to replace the wordmark with your real logo. Leave empty
   * to use the built-in animated wordmark.
   */
  logoSrc: "",
  links: {
    instagram: "https://instagram.com",
    facebook: "https://www.facebook.com/friendsbdmerchandise",
    whatsapp: "https://wa.me/8801000000000",
    messenger: "https://m.me/friendsbdmerchandise",
  },
  contact: {
    email: "hello@friendsmerch.bd",
    phone: "+880 1000-000000",
    address: "Gulshan, Dhaka, Bangladesh",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New Arrivals", href: "/shop?sort=newest", badge: "New" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/shop?sale=true", badge: "Sale" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?sort=bestselling" },
    { label: "Collections", href: "/collections" },
    { label: "Sale", href: "/shop?sale=true" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Order Tracking", href: "/account/orders" },
    { label: "FAQs", href: "/faq" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;
