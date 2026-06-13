import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container flex min-h-[80vh] flex-col items-center justify-center pt-[var(--nav-height)] text-center">
      <p className="font-display text-7xl font-extrabold text-brand md:text-9xl">
        404
      </p>
      <h1 className="heading-display mt-4 text-2xl md:text-3xl">
        Well, this is awkward.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you’re looking for took a break — and we were on a break too.
        Let’s get you back to the good stuff.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to Home
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Browse Shop
        </Link>
      </div>
    </section>
  );
}
