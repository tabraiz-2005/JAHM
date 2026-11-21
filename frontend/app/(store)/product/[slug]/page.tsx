import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import { CashIcon, GiftIcon, TruckIcon } from "@/components/Icons";
import { categoryName, formatPKR, getProduct, getProducts } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  return { title: p?.name ?? "Product", description: p?.tagline };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const related = (await getProducts()).filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 4);
  const more = related.length ? related : (await getProducts()).filter((x) => x.slug !== p.slug).slice(0, 4);

  return (
    <>
      <div className="container-x py-6 text-xs uppercase tracking-widest text-plum/50">
        <Link href="/" className="hover:text-rose">Home</Link> / <Link href={`/shop?category=${p.category}`} className="hover:text-rose">{categoryName(p.category)}</Link> / <span className="text-plum">{p.name}</span>
      </div>

      <section className="container-x grid gap-12 md:grid-cols-2">
        <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush shadow-soft md:sticky md:top-28 md:self-start">
          <Image src={p.image} alt={p.name} fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          {p.oneOfAKind && <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-[11px] uppercase tracking-widest text-plum">One of a kind</span>}
        </div>

        <div className="py-2">
          <p className="eyebrow">{categoryName(p.category)}</p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-plum md:text-5xl">{p.name}</h1>
          <p className="mt-3 font-serif text-xl italic text-rose">{p.tagline}</p>
          <p className="mt-6 text-3xl font-light text-ink">
            {formatPKR(p.price)}
            {p.compareAtPrice && <span className="ml-3 text-lg text-plum/40 line-through">{formatPKR(p.compareAtPrice)}</span>}
          </p>

          {p.stock > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-xs text-plum">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose" />
              {p.oneOfAKind ? "Only 1 exists. Once it's sold, it's gone." : `Small batch: ${p.stock} left`}
            </p>
          )}

          <div className="mt-8"><AddToCart p={p} /></div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-plum">
            <div className="rounded-xl bg-white p-4"><TruckIcon className="mx-auto h-6 w-6 text-rose" /><p className="mt-2">Delivery in 3–5 days</p></div>
            <div className="rounded-xl bg-white p-4"><CashIcon className="mx-auto h-6 w-6 text-rose" /><p className="mt-2">Cash on delivery</p></div>
            <div className="rounded-xl bg-white p-4"><GiftIcon className="mx-auto h-6 w-6 text-rose" /><p className="mt-2">Free gift wrap</p></div>
          </div>

          <div className="mt-10 space-y-3">
            <details open className="card group p-6">
              <summary className="cursor-pointer list-none font-serif text-xl text-plum">The story</summary>
              <p className="mt-4 text-sm leading-relaxed text-plum/80">{p.description}</p>
            </details>
            <details className="card p-6">
              <summary className="cursor-pointer list-none font-serif text-xl text-plum">Details & size</summary>
              <ul className="mt-4 space-y-2 text-sm text-plum/80">
                {p.details.map((d) => <li key={d}>✦ {d}</li>)}
                <li>✦ Size: {p.dimensions}</li>
              </ul>
              <p className="mt-3 text-xs text-plum/50">Because each piece is painted by hand, small variations are part of its charm.</p>
            </details>
            <details className="card p-6">
              <summary className="cursor-pointer list-none font-serif text-xl text-plum">Delivery & care</summary>
              <p className="mt-4 text-sm leading-relaxed text-plum/80">
                Delivered nationwide in 3–5 working days. Free delivery on orders over Rs 8,000. Wipe gently with a soft, dry cloth.
                Keep out of prolonged direct sunlight and avoid soaking painted surfaces.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="container-x pt-24">
        <h2 className="section-title text-center">You may also love</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
          {more.map((x) => <ProductCard key={x.id} p={x} />)}
        </div>
      </section>
    </>
  );
}
