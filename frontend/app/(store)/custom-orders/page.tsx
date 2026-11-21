"use client";
import Image from "next/image";
import { useState } from "react";

export default function CustomOrdersPage() {
  const [f, setF] = useState({ name: "", phone: "", item: "Art Deck", budget: "Rs 8,000 – 15,000", idea: "" });
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || "923000000000";
  const msg = encodeURIComponent(
    `Hi JAHM! Custom order request:\nName: ${f.name}\nPhone: ${f.phone}\nItem: ${f.item}\nBudget: ${f.budget}\nIdea: ${f.idea}`
  );

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blush-soft to-blush py-20">
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Custom orders</p>
            <h1 className="section-title mt-3">Your story, <em className="text-rose">hand-painted.</em></h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-plum/75">
              Personalised trays, name lanterns, portrait decks and matching gift sets for weddings, birthdays, Eid and corporate gifts.
              Share your idea and we&apos;ll send a sketch before a single drop of paint.
            </p>
            <ol className="mt-8 space-y-4 text-sm text-plum">
              <li><b className="font-serif text-lg text-rose">1.</b> Tell us your idea & budget</li>
              <li><b className="font-serif text-lg text-rose">2.</b> Approve the sketch (50% advance)</li>
              <li><b className="font-serif text-lg text-rose">3.</b> We paint it in 7–14 days and deliver</li>
            </ol>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-soft">
            <Image src="/products/crimson-silhouette-tray.jpg" alt="Custom artwork" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="card mx-auto max-w-2xl p-8">
          <h2 className="font-serif text-3xl text-plum">Request a custom piece</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div><label className="label">Name</label><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div><label className="label">Mobile</label><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
            <div>
              <label className="label">What would you like?</label>
              <select className="input" value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })}>
                {["Art Deck", "Lantern", "Tray", "Planter", "Gift Set", "Corporate / bulk"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Budget</label>
              <select className="input" value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })}>
                {["Rs 4,000 – 8,000", "Rs 8,000 – 15,000", "Rs 15,000 – 30,000", "Rs 30,000+"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div className="md:col-span-2"><label className="label">Describe your idea</label><textarea rows={4} className="input" value={f.idea} onChange={(e) => setF({ ...f, idea: e.target.value })} placeholder="Colours, names, theme, occasion, deadline…" /></div>
          </div>
          <a href={`https://wa.me/${wa}?text=${msg}`} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full">Send request on WhatsApp</a>
        </div>
      </section>
    </>
  );
}
