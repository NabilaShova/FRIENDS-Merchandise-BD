import { Marquee } from "@/components/ui/marquee";

const phrases = [
  "How You Doin'?",
  "We Were On A Break",
  "Pivot!",
  "Could I BE Any More Iconic",
  "Central Perk",
  "Smelly Cat",
  "Joey Doesn't Share Food",
  "The One With The Merch",
];

/** Quote ticker that bridges the hero and the collections grid. */
export function BrandMarquee() {
  return (
    <div className="border-y border-border bg-foreground py-4 text-background">
      <Marquee duration={32}>
        {phrases.map((p) => (
          <span
            key={p}
            className="flex items-center gap-6 text-lg font-semibold uppercase tracking-wide md:text-xl"
          >
            {p}
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
