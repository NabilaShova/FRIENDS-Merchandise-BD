import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  reverse?: boolean;
  /** seconds for one full loop */
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
}

/**
 * Infinite, GPU-friendly marquee. Content is duplicated and translated -50%
 * so the loop is seamless. Driven by CSS keyframes (see tailwind.config.ts).
 */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div className={cn("group mask-fade-x flex overflow-hidden", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
          className={cn(
            "flex shrink-0 items-center gap-6 pr-6",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
