import type { Mood, Review } from "@/lib/types";

/** "Shop by Mood" curated entry points. */
export const moods: Mood[] = [
  {
    slug: "coffee-lover",
    title: "Coffee Lover",
    subtitle: "Mugs, tees & more for caffeine devotees",
    emoji: "☕",
    gradient: "from-amber-200/60 to-orange-300/40",
  },
  {
    slug: "central-perk",
    title: "Central Perk",
    subtitle: "The orange couch energy, bottled",
    emoji: "🛋️",
    gradient: "from-orange-200/60 to-rose-200/40",
  },
  {
    slug: "90s-nostalgia",
    title: "90s Nostalgia",
    subtitle: "Retro drops straight from the era",
    emoji: "📼",
    gradient: "from-violet-200/60 to-fuchsia-200/40",
  },
  {
    slug: "minimal-fan",
    title: "Minimal Fan",
    subtitle: "Subtle nods for the understated",
    emoji: "◻️",
    gradient: "from-slate-200/60 to-zinc-300/40",
  },
  {
    slug: "gift-collection",
    title: "Gift Collection",
    subtitle: "Perfectly wrapped for the super-fan",
    emoji: "🎁",
    gradient: "from-emerald-200/60 to-teal-200/40",
  },
  {
    slug: "collector-edition",
    title: "Collector Edition",
    subtitle: "Limited runs for the true collector",
    emoji: "🏆",
    gradient: "from-yellow-200/60 to-amber-300/40",
  },
];

export const reviews: Review[] = [
  {
    id: "r-1",
    author: "Anika Rahman",
    location: "Dhaka",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    title: "Could this BE any better?",
    body: "The oversized tee fabric is unreal — premium feel, true to size, and shipped in two days. My whole friend group ordered after seeing mine.",
    productName: "Central Perk Logo Oversized Tee",
  },
  {
    id: "r-2",
    author: "Tanvir Hasan",
    location: "Chittagong",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    title: "Best fandom store in BD",
    body: "Packaging felt like opening a gift. The hoodie embroidery is super clean. This is what official merch should feel like.",
    productName: "How You Doin'? Hoodie",
  },
  {
    id: "r-3",
    author: "Sadia Islam",
    location: "Sylhet",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
    title: "Obsessed with the mug",
    body: "Bought the Central Perk mug as a gift and ended up buying three more. Quality print that survives the dishwasher!",
    productName: "Central Perk Ceramic Mug",
  },
  {
    id: "r-4",
    author: "Rafsan Karim",
    location: "Khulna",
    avatar: "https://i.pravatar.cc/120?img=15",
    rating: 4,
    title: "Fast & legit",
    body: "Was nervous about authenticity but everything is clearly official quality. bKash checkout was instant.",
  },
  {
    id: "r-5",
    author: "Mehjabin Chowdhury",
    location: "Rajshahi",
    avatar: "https://i.pravatar.cc/120?img=20",
    rating: 5,
    title: "My happy place",
    body: "Scrolling this store feels like an episode marathon. Found the perfect birthday gift for my best friend.",
    productName: "Friends Logo Bifold Wallet",
  },
];
