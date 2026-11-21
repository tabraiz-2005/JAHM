"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPKR } from "@/lib/catalog";
import { createOrder } from "@/lib/store";
import type { Order } from "@/lib/types";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Gujranwala", "Sialkot", "Quetta", "Hyderabad", "Other"];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "Lahore", address: "", notes: "" });
  const [payment, setPayment] = useState<"cod" | "bank">("cod");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^(\+92|0)?3\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      setError("Please enter a valid Pakistani mobile number, e.g. 03XX XXXXXXX");
      return;
    }
    setPlacing(true);
    const order = await createOrder({
      customer: form,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod: payment,
    });
    clear();
    setDone(order);
    setPlacing(false);
  }

  if (done)
    return (
      <section className="container-x py-24 text-center">
        <p className="font-script text-6xl text-rose">Thank you!</p>
        <h1 className="section-title mt-4">Your order is placed</h1>
        <p className="mt-4 text-plum/70">Order <b className="text-plum">{done.id}</b> · Total {formatPKR(done.total)}</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-plum/70">
          We&apos;ll call or WhatsApp you at <b>{done.customer.phone}</b> to confirm within 24 hours. Your piece will be wrapped by hand and sent with love.
        </p>
        <Link href="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </section>
    );

  if (items.length === 0)
    return (
      <section className="container-x py-24 text-center">
        <h1 className="section-title">Your bag is empty</h1>
        <Link href="/shop" className="btn-primary mt-8">Explore the collection</Link>
      </section>
    );

  return (
    <section className="container-x py-16">
      <h1 className="section-title">Checkout</h1>
      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <div className="card p-7">
            <h2 className="font-serif text-2xl text-plum">Delivery details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div><label className="label">Full name *</label><input required className="input" value={form.name} onChange={set("name")} /></div>
              <div><label className="label">Mobile number *</label><input required className="input" placeholder="03XX XXXXXXX" value={form.phone} onChange={set("phone")} /></div>
              <div><label className="label">Email (optional)</label><input type="email" className="input" value={form.email} onChange={set("email")} /></div>
              <div>
                <label className="label">City *</label>
                <select className="input" value={form.city} onChange={set("city")}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <div className="md:col-span-2"><label className="label">Full address *</label><textarea required rows={3} className="input" value={form.address} onChange={set("address")} /></div>
              <div className="md:col-span-2"><label className="label">Gift note / special instructions</label><textarea rows={2} className="input" value={form.notes} onChange={set("notes")} placeholder="We'll handwrite it on a card for you" /></div>
            </div>
          </div>

          <div className="card p-7">
            <h2 className="font-serif text-2xl text-plum">Payment</h2>
            <div className="mt-5 space-y-3">
              {[
                { v: "cod" as const, t: "Cash on Delivery", s: "Pay in cash when your order arrives." },
                { v: "bank" as const, t: "Bank Transfer / JazzCash / Easypaisa", s: "We'll send account details on WhatsApp after you order." },
              ].map((o) => (
                <label key={o.v} className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition ${payment === o.v ? "border-rose bg-blush-soft" : "border-blush-deep"}`}>
                  <input type="radio" name="pay" checked={payment === o.v} onChange={() => setPayment(o.v)} className="mt-1 accent-rose" />
                  <span><span className="block font-medium text-plum">{o.t}</span><span className="text-xs text-plum/60">{o.s}</span></span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="card h-fit p-7 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl text-plum">Your order</h2>
          <ul className="mt-5 space-y-4">
            {items.map((i) => (
              <li key={i.slug} className="flex items-center gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-blush">
                  <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute right-0 top-0 rounded-bl-lg bg-rose px-1.5 text-[10px] text-white">{i.qty}</span>
                </div>
                <p className="flex-1 text-sm text-plum">{i.name}</p>
                <p className="text-sm">{formatPKR(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-blush-deep pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPKR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping ? formatPKR(shipping) : "Free"}</dd></div>
            <div className="flex justify-between pt-2 font-serif text-2xl text-plum"><dt>Total</dt><dd>{formatPKR(total)}</dd></div>
          </dl>
          {error && <p className="mt-4 rounded-lg bg-rose/10 p-3 text-xs text-rose-dark">{error}</p>}
          <button disabled={placing} className="btn-primary mt-6 w-full disabled:opacity-60">{placing ? "Placing order…" : "Place order"}</button>
          <p className="mt-3 text-center text-xs text-plum/60">🔒 Your details are only used to deliver your order.</p>
        </aside>
      </form>
    </section>
  );
}
