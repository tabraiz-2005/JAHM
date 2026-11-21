export type CategorySlug = "art-decks" | "lanterns" | "trays" | "planters" | "gift-sets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice: number | null;
  image: string;
  tagline: string;
  description: string;
  details: string[];
  dimensions: string;
  oneOfAKind: boolean;
  featured: boolean;
  bestseller: boolean;
  stock: number;
  status: "active" | "draft";
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  giftWrap?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email?: string; city: string; address: string; notes?: string };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "cod" | "bank";
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  productSlug?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteSettings {
  hero: { autoplaySeconds: number; slides: HeroSlide[] };
  categoryImages: Record<string, string>;
  sections: { bannerImage: string; customOrderImage: string };
}
