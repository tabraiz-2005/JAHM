"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatPKR } from "@/lib/catalog";
import type { Product, SiteSettings } from "@/lib/types";

export default function Hero({ hero, products }: { hero: SiteSettings["hero"]; products: Product[] }) {
  const slides = hero.slides.length ? hero.slides : [];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const dur = Math.max(2, hero.autoplaySeconds || 6);
  const n = slides.length;

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => go(i + 1), dur * 1000);
    return () => clearTimeout(t);
  }, [i, paused, dur, n, go]);

  if (!n) return null;
  const s = slides[i];
  const next = slides[(i + 1) % n];
  const product = products.find((p) => p.slug === s.productSlug);

  return (
    <section
      className={`relative isolate overflow-hidden bg-plum-dark text-white ${paused ? "paused" : ""}`}
      style={{ ["--hero-dur" as string]: `${dur}s` }}
    >
      {/* Blurred, colour-washed backdrop of the current slide */}
      {slides.map((sl, k) => (
        <div key={k} className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}>
          <Image src={sl.image} alt="" fill sizes="100vw" className="scale-125 object-cover blur-3xl" priority={k === 0} />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-plum-dark via-plum/85 to-rose/40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(194,155,87,0.25),transparent_55%)]" />
      <p className="text-outline pointer-events-none absolute -bottom-10 left-0 -z-10 select-none whitespace-nowrap font-serif text-[22vw] leading-none tracking-[0.15em]">JAHM</p>

      <div className="container-x grid min-h-[calc(100svh-7rem)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-10">
        {/* ---------- Copy ---------- */}
        <div key={i} className="relative z-10 max-w-xl">
          <p className="fade-up flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-gold-light">
            <span className="h-px w-10 bg-gold-light" /> {s.eyebrow}
          </p>
          <h1 className="fade-up-2 mt-6 font-serif text-5xl font-medium leading-[1.02] md:text-7xl xl:text-8xl">
            {s.title}
            <br />
            <span className="font-script text-6xl font-normal text-blush md:text-8xl xl:text-[7.5rem]">{s.highlight}</span>
          </h1>
          <p className="fade-up-3 mt-6 max-w-md text-base leading-relaxed text-blush/85 md:text-lg">{s.subtitle}</p>
          <div className="fade-up-3 mt-9 flex flex-wrap gap-4">
            <Link href={s.ctaHref || "/shop"} className="btn bg-white text-rose shadow-soft hover:-translate-y-0.5 hover:bg-blush">
              {s.ctaLabel || "Shop now"} <span aria-hidden>→</span>
            </Link>
            <Link href="/custom-orders" className="btn border border-white/50 text-white hover:bg-white hover:text-rose">Commission a piece</Link>
          </div>
          <div className="fade-up-3 mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {[
              ["100%", "Hand-painted"],
              ["1 of 1", "Most pieces"],
              ["COD", "All of Pakistan"],
            ].map(([a, b]) => (
              <div key={b}>
                <p className="font-serif text-2xl text-white md:text-3xl">{a}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-blush/70">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Visual stage ---------- */}
        <div
          className="relative order-first h-[52vh] min-h-[380px] lg:order-none lg:h-[74vh] lg:max-h-[760px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Next slide peeking behind */}
          {n > 1 && (
            <button
              onClick={() => go(i + 1)}
              aria-label="Next slide"
              className="absolute bottom-6 left-0 z-0 h-[46%] w-[38%] -rotate-6 overflow-hidden rounded-[1.75rem] border-4 border-white/20 shadow-2xl transition hover:-rotate-3 hover:scale-105"
            >
              <Image src={next.image} alt="" fill sizes="20vw" className="object-cover opacity-80" />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-plum-dark/80 to-transparent p-4 text-left text-[10px] uppercase tracking-[0.25em] text-white">Next →</span>
            </button>
          )}

          {/* Main image */}
          <div className="absolute right-0 top-0 z-10 h-full w-[76%] overflow-hidden rounded-[2.5rem] border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
            {slides.map((sl, k) => (
              <div key={k} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}>
                <div key={k === i ? `on-${i}` : `off-${k}`} className={`absolute inset-0 ${k === i ? "kenburns" : ""}`}>
                  <Image src={sl.image} alt={`${sl.title} ${sl.highlight}`} fill sizes="(max-width:1024px) 80vw, 45vw" className="object-cover" priority={k === 0} />
                </div>
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/50 via-transparent to-transparent" />
          </div>

          {/* Spinning stamp */}
          <div className="absolute left-[16%] top-2 z-20 hidden h-28 w-28 md:block">
            <svg viewBox="0 0 100 100" className="spin-slow h-full w-full">
              <defs><path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
              <circle cx="50" cy="50" r="49" fill="#FCF8F6" />
              <text fill="#A3545C" fontSize="9.5" letterSpacing="3" fontFamily="Jost, sans-serif">
                <textPath href="#circ">HAND PAINTED • ONE OF A KIND • </textPath>
              </text>
            </svg>
            <Image src="/brand/logo.png" alt="" width={44} height={44} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </div>

          {/* Product card */}
          {product && (
            <Link
              key={`card-${i}`}
              href={`/product/${product.slug}`}
              className="fade-up-3 float-y absolute bottom-8 right-4 z-20 flex w-[min(300px,80%)] items-center gap-4 rounded-2xl bg-white/95 p-3 pr-5 text-ink shadow-2xl backdrop-blur transition hover:bg-white md:right-[-1rem]"
            >
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-blush">
                <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose">{product.stock > 0 ? (product.oneOfAKind ? "Only 1 available" : `${product.stock} left`) : "Sold out"}</p>
                <p className="truncate font-serif text-lg leading-tight text-plum">{product.name.split("—")[0].trim()}</p>
                <p className="text-sm font-medium">{formatPKR(product.price)}</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose text-white">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* ---------- Slide controls ---------- */}
      {n > 1 && (
        <div className="container-x absolute inset-x-0 bottom-6 z-20 hidden items-center gap-6 lg:flex">
          {slides.map((sl, k) => (
            <button key={k} onClick={() => go(k)} className="group w-28 text-left" aria-label={`Go to slide ${k + 1}`}>
              <span className={`text-xs tracking-widest ${k === i ? "text-white" : "text-white/40 group-hover:text-white/70"}`}>0{k + 1}</span>
              <span className="mt-2 block h-[2px] overflow-hidden rounded bg-white/20">
                {k === i && <span key={`p-${i}`} className="hero-progress block h-full bg-gold-light" />}
                {k < i && <span className="block h-full w-full bg-white/50" />}
              </span>
            </button>
          ))}
          <a href="#explore" className="ml-auto flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/60 hover:text-white">
            Scroll to explore <span className="float-y inline-block">↓</span>
          </a>
        </div>
      )}
      {/* mobile dots */}
      {n > 1 && (
        <div className="flex justify-center gap-2 pb-8 lg:hidden">
          {slides.map((_, k) => (
            <button key={k} onClick={() => go(k)} aria-label={`Slide ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-gold-light" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      )}
    </section>
  );
}
