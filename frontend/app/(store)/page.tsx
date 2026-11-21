import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductRibbon from "@/components/ProductRibbon";
import { BrushIcon, CashIcon, GiftIcon, InstagramIcon, TruckIcon } from "@/components/Icons";
import { CATEGORIES, getProducts, getSettings } from "@/lib/catalog";

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <Hero hero={settings.hero} products={products} />
      <ProductRibbon products={products} />

      {/* ---------- TRUST BAR ---------- */}
      <section className="container-x relative z-10 pt-12">
        <div className="card grid grid-cols-2 gap-6 px-6 py-7 md:grid-cols-4">
          {[
            { icon: <BrushIcon />, t: "Hand-painted", s: "Every brushstroke is real" },
            { icon: <TruckIcon />, t: "Nationwide delivery", s: "Free over Rs 8,000" },
            { icon: <CashIcon />, t: "Cash on delivery", s: "Pay when it arrives" },
            { icon: <GiftIcon />, t: "Gift-ready", s: "Wrapped with a handwritten note" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-4">
              <span className="text-rose">{f.icon}</span>
              <div>
                <p className="text-sm font-medium text-plum">{f.t}</p>
                <p className="text-xs text-plum/60">{f.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="container-x pt-24">
        <div className="text-center">
          <p className="eyebrow">Explore</p>
          <h2 className="section-title mt-3">Shop by collection</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group text-center">
              <div className="img-zoom relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-full border-4 border-white bg-blush shadow-soft">
                <Image src={settings.categoryImages[c.slug] || c.image} alt={c.name} fill sizes="240px" className="object-cover" />
              </div>
              <p className="mt-5 font-serif text-2xl text-plum transition group-hover:text-rose">{c.name}</p>
              <p className="mt-1 text-xs text-plum/60">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- BESTSELLERS ---------- */}
      <section className="container-x pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Most loved</p>
            <h2 className="section-title mt-3">Bestsellers</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-[0.2em] text-rose hover:underline">View all pieces →</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* ---------- STATEMENT BANNER ---------- */}
      <section className="container-x pt-24">
        <div className="grid overflow-hidden rounded-[2rem] bg-rose md:grid-cols-2">
          <div className="flex flex-col justify-center p-10 text-white md:p-16">
            <p className="text-xs uppercase tracking-[0.3em] text-blush">The Launch Edit</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">One piece. One owner.<br /><em>Forever yours.</em></h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-blush">
              We never repeat a design exactly. When you buy from JAHM you own something no one else has, wrapped by hand and delivered to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop?category=art-decks" className="btn-light">Shop art decks</Link>
              <Link href="/custom-orders" className="btn border border-white/60 text-white hover:bg-white hover:text-rose">Make it personal</Link>
            </div>
          </div>
          <div className="relative min-h-[360px]">
            <Image src={settings.sections.bannerImage} alt="Hand-painted art deck" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ---------- FEATURED GRID ---------- */}
      <section className="container-x pt-24">
        <div className="text-center">
          <p className="eyebrow">Fresh from the studio</p>
          <h2 className="section-title mt-3">The Collection</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-plum/70">Every piece below is the only one in existence. Add to your bag before someone else does.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        <div className="mt-12 text-center">
          <Link href="/shop" className="btn-outline">See everything</Link>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="mt-24 bg-blush-soft py-24">
        <div className="container-x">
          <div className="text-center">
            <p className="eyebrow">How it&apos;s made</p>
            <h2 className="section-title mt-3">From blank surface to your home</h2>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { n: "01", t: "Sketched", s: "Every design starts as a hand-drawn sketch, planned for the shape of the piece." },
              { n: "02", t: "Painted by hand", s: "Layer by layer in acrylics, with real gold leaf where it shines. Some pieces take days." },
              { n: "03", t: "Sealed & wrapped", s: "Varnished to last, then gift-wrapped with a handwritten note and sent to your door." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <p className="font-serif text-6xl text-rose/30">{s.n}</p>
                <h3 className="mt-2 font-serif text-2xl text-plum">{s.t}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-plum/70">{s.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CUSTOM ORDERS CTA ---------- */}
      <section className="container-x pt-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft">
            <Image src={settings.sections.customOrderImage} alt="Custom painted piece" fill sizes="50vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">Custom orders</p>
            <h2 className="section-title mt-3">Make it unmistakably <em className="text-rose">theirs</em></h2>
            <p className="mt-5 text-sm leading-relaxed text-plum/75">
              Names on a tray, a favourite pet on a deck, wedding colours on a set of lanterns. Tell us the story and we&apos;ll paint it.
              Perfect for birthdays, weddings, Eid and corporate gifting.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-plum">
              <li>✦ Personal design consultation on WhatsApp</li>
              <li>✦ Sketch approval before we paint</li>
              <li>✦ Ready in 7–14 days</li>
            </ul>
            <Link href="/custom-orders" className="btn-primary mt-8">Start a custom order</Link>
          </div>
        </div>
      </section>

      {/* ---------- INSTAGRAM ---------- */}
      <section className="container-x pt-24">
        <div className="text-center">
          <p className="eyebrow">@jahmstudio.official</p>
          <h2 className="section-title mt-3">Follow the brush</h2>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-2 md:grid-cols-6">
          {products.slice(0, 6).map((p) => (
            <a key={p.id} href="https://instagram.com/jahmstudio.official" target="_blank" rel="noreferrer" className="img-zoom group relative aspect-square overflow-hidden rounded-xl">
              <Image src={p.image} alt={p.name} fill sizes="200px" className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-plum/0 text-white opacity-0 transition group-hover:bg-plum/40 group-hover:opacity-100">
                <InstagramIcon className="h-7 w-7" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
