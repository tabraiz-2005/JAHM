"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageField from "@/components/admin/ImageField";
import { CATEGORIES } from "@/lib/catalog";
import { backendOnline, listProducts, loadSettings, saveSettings } from "@/lib/store";
import type { HeroSlide, Product, SiteSettings } from "@/lib/types";

const blankSlide = (): HeroSlide => ({
  image: "/products/koi-pond-deck.jpg",
  eyebrow: "New arrival",
  title: "Your headline",
  highlight: "here.",
  subtitle: "A short line that makes people want to scroll.",
  productSlug: "",
  ctaLabel: "Shop now",
  ctaHref: "/shop",
});

export default function ContentEditor() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    loadSettings().then(setS);
    listProducts().then(setProducts);
    backendOnline().then(setOnline);
  }, []);

  if (!s) return <p className="text-plum/60">Loading…</p>;

  const slides = s.hero.slides;
  const setSlides = (next: HeroSlide[]) => setS({ ...s, hero: { ...s.hero, slides: next } });
  const setSlide = (i: number, patch: Partial<HeroSlide>) => setSlides(slides.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[i], next[j]] = [next[j], next[i]];
    setSlides(next);
    setOpen(j);
  };

  async function save() {
    if (!s) return;
    setSaving(true);
    const res = await saveSettings(s);
    setSaving(false);
    if (res) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else alert("Could not save. Make sure the Python API (backend) is running.");
  }

  return (
    <div className="pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Homepage</p>
          <h1 className="mt-2 font-serif text-4xl text-plum">Site Content</h1>
          <p className="mt-2 text-sm text-plum/60">Change the hero slideshow and homepage images. Changes go live as soon as you save.</p>
        </div>
        <Link href="/" target="_blank" className="btn-outline !px-5 !py-2.5">Preview store ↗</Link>
      </div>

      {online === false && (
        <div className="mt-6 rounded-2xl bg-amber-50 px-6 py-4 text-sm text-amber-900">
          ⚠️ The Python API is not running, so homepage changes can&apos;t be saved. Start the backend and refresh this page.
        </div>
      )}

      {/* ---------------- HERO ---------------- */}
      <section className="card mt-8 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-plum">Hero slideshow</h2>
            <p className="text-xs text-plum/60">The big first screen visitors see. Tall (portrait) photos look best.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="text-plum/70">Change slide every</label>
            <input
              type="number"
              min={2}
              max={30}
              className="input !w-20 !py-2"
              value={s.hero.autoplaySeconds}
              onChange={(e) => setS({ ...s, hero: { ...s.hero, autoplaySeconds: Math.min(30, Math.max(2, +e.target.value || 6)) } })}
            />
            <span className="text-plum/70">sec</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {slides.map((sl, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-blush-deep">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center gap-4 bg-blush-soft/60 px-4 py-3 text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sl.image} alt="" className="h-14 w-11 rounded-lg object-cover" />
                <span className="flex-1">
                  <span className="block text-xs uppercase tracking-widest text-rose">Slide {i + 1}</span>
                  <span className="font-serif text-lg text-plum">{sl.title} <em className="text-rose">{sl.highlight}</em></span>
                </span>
                <span className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => move(i, -1)} className="rounded-lg px-2 py-1 text-plum/60 hover:bg-white" title="Move up">↑</button>
                  <button type="button" onClick={() => move(i, 1)} className="rounded-lg px-2 py-1 text-plum/60 hover:bg-white" title="Move down">↓</button>
                  <button
                    type="button"
                    onClick={() => slides.length > 1 ? setSlides(slides.filter((_, j) => j !== i)) : alert("Keep at least one slide")}
                    className="rounded-lg px-2 py-1 text-plum/60 hover:bg-white hover:text-rose"
                    title="Remove"
                  >✕</button>
                </span>
              </button>

              {open === i && (
                <div className="grid gap-5 p-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <ImageField label="Slide image" tall value={sl.image} onChange={(image) => setSlide(i, { image })} />
                  </div>
                  <div><label className="label">Small top line</label><input className="input" value={sl.eyebrow} onChange={(e) => setSlide(i, { eyebrow: e.target.value })} /></div>
                  <div>
                    <label className="label">Featured product card</label>
                    <select className="input" value={sl.productSlug || ""} onChange={(e) => setSlide(i, { productSlug: e.target.value })}>
                      <option value="">— none —</option>
                      {products.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Headline</label><input className="input" value={sl.title} onChange={(e) => setSlide(i, { title: e.target.value })} /></div>
                  <div><label className="label">Highlighted words (script font)</label><input className="input" value={sl.highlight} onChange={(e) => setSlide(i, { highlight: e.target.value })} /></div>
                  <div className="md:col-span-2"><label className="label">Subtitle</label><textarea rows={2} className="input" value={sl.subtitle} onChange={(e) => setSlide(i, { subtitle: e.target.value })} /></div>
                  <div><label className="label">Button text</label><input className="input" value={sl.ctaLabel} onChange={(e) => setSlide(i, { ctaLabel: e.target.value })} /></div>
                  <div><label className="label">Button link</label><input className="input" value={sl.ctaHref} onChange={(e) => setSlide(i, { ctaHref: e.target.value })} placeholder="/shop?category=lanterns" /></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => { setSlides([...slides, blankSlide()]); setOpen(slides.length); }} className="btn-outline mt-5 !px-5 !py-2.5">+ Add slide</button>
      </section>

      {/* ---------------- COLLECTION IMAGES ---------------- */}
      <section className="card mt-8 p-6 md:p-8">
        <h2 className="font-serif text-2xl text-plum">Collection circles</h2>
        <p className="text-xs text-plum/60">The round images in “Shop by collection”.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <ImageField
              key={c.slug}
              label={c.name}
              value={s.categoryImages[c.slug] ?? c.image}
              onChange={(url) => setS({ ...s, categoryImages: { ...s.categoryImages, [c.slug]: url } })}
            />
          ))}
        </div>
      </section>

      {/* ---------------- SECTION IMAGES ---------------- */}
      <section className="card mt-8 p-6 md:p-8">
        <h2 className="font-serif text-2xl text-plum">Section images</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ImageField label="“One piece. One owner.” banner" tall value={s.sections.bannerImage} onChange={(bannerImage) => setS({ ...s, sections: { ...s.sections, bannerImage } })} />
          <ImageField label="Custom orders section" tall value={s.sections.customOrderImage} onChange={(customOrderImage) => setS({ ...s, sections: { ...s.sections, customOrderImage } })} />
        </div>
      </section>

      {/* ---------------- SAVE BAR ---------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blush-deep bg-white/95 backdrop-blur md:left-64">
        <div className="flex items-center justify-end gap-4 px-6 py-4 md:px-10">
          {saved && <span className="text-sm text-green-700">✓ Saved. Refresh the store to see it.</span>}
          <button onClick={() => loadSettings().then(setS)} className="text-sm text-plum/60 hover:text-rose">Discard changes</button>
          <button onClick={save} disabled={saving || online === false} className="btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save homepage"}</button>
        </div>
      </div>
    </div>
  );
}
