"use client";
import Image from "next/image";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, formatPKR } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import { CloseIcon } from "./Icons";

export default function CartDrawer() {
  const { items, open, setOpen, subtotal, setQty, remove } = useCart();
  const left = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-plum/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-blush-deep px-6 py-5">
          <h3 className="font-serif text-2xl text-plum">Your Bag</h3>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="text-plum"><CloseIcon /></button>
        </div>

        <div className="border-b border-blush-deep px-6 py-4 text-sm text-plum">
          {left > 0 ? (
            <>You&apos;re <b className="text-rose">{formatPKR(left)}</b> away from <b>free delivery</b></>
          ) : (
            <>You&apos;ve unlocked <b className="text-rose">free delivery</b> ✨</>
          )}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blush-deep">
            <div className="h-full rounded-full bg-rose transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-plum">Your bag is empty</p>
              <p className="mt-2 text-sm text-plum/60">Each piece is one of a kind. Find yours before it&apos;s gone.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary mt-6">Explore the collection</Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-blush">
                    <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-lg leading-tight text-plum">{i.name}</p>
                      <button onClick={() => remove(i.slug)} className="text-xs text-plum/50 hover:text-rose">Remove</button>
                    </div>
                    <p className="mt-1 text-sm text-rose">{formatPKR(i.price)}</p>
                    <div className="mt-auto flex w-fit items-center rounded-full border border-blush-deep text-sm">
                      <button className="px-3 py-1" onClick={() => setQty(i.slug, i.qty - 1)}>−</button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <button className="px-3 py-1" onClick={() => setQty(i.slug, i.qty + 1)}>+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-blush-deep px-6 py-5">
            <div className="flex justify-between font-serif text-xl text-plum">
              <span>Subtotal</span><span>{formatPKR(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-plum/60">Gift wrapping included. Delivery calculated at checkout.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">Checkout · Cash on Delivery</Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="mt-3 block text-center text-xs uppercase tracking-widest text-plum/70 hover:text-rose">View full bag</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
