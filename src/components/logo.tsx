import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Brand logo. Renders the real logo image when `siteConfig.logoSrc` is set
 * (drop your file at `public/brand/logo.png`); otherwise falls back to the
 * built-in animated wordmark whose coloured dots echo the FRIENDS title card.
 */
export function Logo({ className }: { className?: string }) {
  if (siteConfig.logoSrc) {
    return (
      <Link
        href="/"
        aria-label={`${siteConfig.name} — home`}
        className={cn("inline-flex items-center", className)}
      >
        <Image
          src={siteConfig.logoSrc}
          alt={siteConfig.name}
          width={160}
          height={40}
          priority
          className="h-9 w-auto object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="FRIENDS Merchandise BD — home"
      className={cn(
        "group inline-flex items-baseline gap-1 font-display text-xl font-extrabold tracking-tight",
        className,
      )}
    >
      <span className="text-foreground">FRIENDS</span>
      <Dot className="bg-brand" />
      <Dot className="bg-accent" />
      <span className="text-brand">Merch</span>
      <span className="text-[0.6em] font-bold uppercase tracking-widest text-muted-foreground">
        BD
      </span>
    </Link>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full transition-transform duration-300 group-hover:scale-150",
        className,
      )}
    />
  );
}
