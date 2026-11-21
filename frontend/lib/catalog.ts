import seed from "@/data/products.json";
import defaultSettings from "@/data/settings.json";
import type { CategorySlug, Product, SiteSettings } from "./types";

export const CATEGORIES: { slug: CategorySlug; name: string; blurb: string; image: string }[] = [
  { slug: "art-decks", name: "Art Decks", blurb: "Skateboard decks painted as wall art", image: "/products/koi-pond-deck.jpg" },
  { slug: "lanterns", name: "Lanterns", blurb: "Hand-painted light for slow evenings", image: "/products/lavender-hurricane-lantern.jpg" },
  { slug: "trays", name: "Art Trays", blurb: "Serve on it, style with it, hang it", image: "/products/afternoon-tea-tray.jpg" },
  { slug: "planters", name: "Planters", blurb: "Little pots with big personality", image: "/products/noir-gilded-planter.jpg" },
];

export const SEED_PRODUCTS = seed as Product[];

export const FREE_SHIPPING_THRESHOLD = 8000;
export const SHIPPING_FEE = 250;

export function formatPKR(n: number) {
  return "Rs " + n.toLocaleString("en-PK");
}

export function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? (slug === "gift-sets" ? "Gift Sets" : slug);
}

const API = process.env.NEXT_PUBLIC_API_URL;

/**
 * Loads products from the FastAPI backend when it is running,
 * otherwise falls back to the local seed data so the site always works.
 */
export async function getProducts(): Promise<Product[]> {
  if (API) {
    try {
      const res = await fetch(`${API}/api/products`, { cache: "no-store" });
      if (res.ok) return (await res.json()) as Product[];
    } catch {
      /* backend not running — use seed data */
    }
  }
  return SEED_PRODUCTS.filter((p) => p.status === "active");
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export const DEFAULT_SETTINGS = defaultSettings as SiteSettings;

/** Homepage content (hero slides, section images) — editable in /admin/content. */
export async function getSettings(): Promise<SiteSettings> {
  if (API) {
    try {
      const res = await fetch(`${API}/api/settings`, { cache: "no-store" });
      if (res.ok) return (await res.json()) as SiteSettings;
    } catch {
      /* backend not running — use defaults */
    }
  }
  return DEFAULT_SETTINGS;
}
