import Image from "next/image";
import Link from "next/link";
import { formatPKR } from "@/lib/catalog";
import type { Product } from "@/lib/types";

/** Endless scrolling strip of products right under the hero, pulling visitors into the shop. */
export default function ProductRibbon({ products }: { products: Product[] }) {
  const row = [...products, ...products];
  return (
    <section id="explore" className="ribbon overflow-hidden border-b border-blush-deep bg-cream py-10">
      <div className="container-x mb-6 flex items-center justify-between">
        <p className="eyebrow">Fresh from the studio · hover to pause</p>
        <Link href="/shop" className="text-xs uppercase tracking-[0.2em] text-rose hover:underline">Shop all →</Link>
      </div>
      <div className="marquee flex w-max gap-5 px-5">
        {row.map((p, k) => (
          <Link key={`${p.id}-${k}`} href={`/product/${p.slug}`} className="group w-48 shrink-0 md:w-56">
            <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
              <Image src={p.image} alt={p.name} fill sizes="224px" className="object-cover" />
              {p.oneOfAKind && p.stock > 0 && <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-plum">1 of 1</span>}
            </div>
            <p className="mt-3 truncate font-serif text-lg text-plum group-hover:text-rose">{p.name.split("—")[0].trim()}</p>
            <p className="text-sm text-ink">{formatPKR(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
