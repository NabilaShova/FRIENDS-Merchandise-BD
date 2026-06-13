import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Phone } from "lucide-react";
import { footerNav, siteConfig } from "@/lib/site";
import { Logo } from "@/components/logo";

const columns = [
  { title: "Shop", links: footerNav.shop },
  { title: "Support", links: footerNav.support },
  { title: "Company", links: footerNav.company },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="flex gap-2">
            <Social href={siteConfig.links.instagram} label="Instagram">
              <Instagram className="h-4 w-4" />
            </Social>
            <Social href={siteConfig.links.facebook} label="Facebook">
              <Facebook className="h-4 w-4" />
            </Social>
            <Social href={siteConfig.links.whatsapp} label="WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </Social>
            <Social href={`tel:${siteConfig.contact.phone}`} label="Call us">
              <Phone className="h-4 w-4" />
            </Social>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Fan-made tribute store.
          </p>
          <p>
            Crafted with <span className="text-brand">♥</span> in Dhaka,
            Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Social({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-brand-foreground"
    >
      {children}
    </a>
  );
}
