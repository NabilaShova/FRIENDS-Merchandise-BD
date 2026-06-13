import Image from "next/image";
import { Heart, Instagram } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";

const posts = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=80",
];

/** Auto-scrolling social wall (Instagram + Facebook). */
export function SocialFeed() {
  return (
    <section className="section overflow-hidden">
      <div className="container">
        <SectionHeading
          eyebrow="@friendsmerch.bd"
          title="Join the fandom on social"
          description="Tag us to be featured. Auto-updating from Instagram & Facebook."
          align="center"
        />
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <Marquee duration={50}>
          {posts.map((src, i) => (
            <SocialCard key={`a-${i}`} src={src} />
          ))}
        </Marquee>
        <Marquee duration={60} reverse>
          {[...posts].reverse().map((src, i) => (
            <SocialCard key={`b-${i}`} src={src} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function SocialCard({ src }: { src: string }) {
  return (
    <div className="group relative h-48 w-48 shrink-0 overflow-hidden rounded-3xl shadow-soft md:h-56 md:w-56">
      <Image
        src={src}
        alt="FRIENDS Merchandise community post"
        fill
        sizes="224px"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <Instagram className="h-6 w-6 text-white" />
        <span className="flex items-center gap-1 text-sm font-semibold text-white">
          <Heart className="h-4 w-4 fill-white" /> 1.2k
        </span>
      </div>
    </div>
  );
}
