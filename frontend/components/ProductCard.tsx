"use client";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryName, formatPKR } from "@/lib/catalog";
import { useCart } from "./CartProvider";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const soldOut = p.stock <= 0;
  return (
    <div className="group">
      <Link href={`/product/${p.slug}`} className="img-zoom relative block aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
        <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {p.oneOfAKind && !soldOut && <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-plum">One of a kind</span>}
          {p.bestseller && !soldOut && <span className="rounded-full bg-rose px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white">Bestseller</span>}
          {soldOut && <span className="rounded-full bg-plum px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white">Sold out</span>}
        </div>
        {!soldOut && (
          <button
            onClick={(e) => {
              e.preventDefault();
              add({ slug: p.slug, name: p.name, price: p.price, image: p.image });
            }}
            className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-white/95 py-3 text-xs font-medium uppercase tracking-[0.18em] text-plum opacity-0 shadow-soft transition duration-300 hover:bg-rose hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
          >
            Add to bag
          </button>
        )}
      </Link>
      <div className="mt-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-rose/80">{categoryName(p.category)}</p>
        <Link href={`/product/${p.slug}`} className="mt-1 block font-serif text-xl leading-snug text-plum hover:text-rose">{p.name}</Link>
        <p className="mt-1 text-sm font-medium text-ink">
          {formatPKR(p.price)}
          {p.compareAtPrice && <span className="ml-2 text-plum/40 line-through">{formatPKR(p.compareAtPrice)}</span>}
        </p>
      </div>
    </div>
  );
}
