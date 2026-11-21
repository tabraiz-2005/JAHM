"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPKR } from "@/lib/catalog";

export default function CartPage() {
  const { items, subtotal, setQty, remove, toggleGiftWrap } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;

  return (
    <section className="container-x py-16">
      <h1 className="section-title">Your Bag</h1>
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl text-plum">Your bag is empty.</p>
          <Link href="/shop" className="btn-primary mt-6">Explore the collection</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-blush-deep">
            {items.map((i) => (
              <li key={i.slug} className="flex gap-5 py-6">
                <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl bg-blush">
                  <Image src={i.image} alt={i.name} fill sizes="112px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link href={`/product/${i.slug}`} className="font-serif text-xl text-plum hover:text-rose">{i.name}</Link>
                    <p className="font-medium">{formatPKR(i.price * i.qty)}</p>
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs text-plum/70">
                    <input type="checkbox" checked={!!i.giftWrap} onChange={() => toggleGiftWrap(i.slug)} className="accent-rose" />
                    Gift wrap with a handwritten note (free)
                  </label>
                  <div className="mt-auto flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-blush-deep text-sm">
                      <button className="px-3 py-1" onClick={() => setQty(i.slug, i.qty - 1)}>−</button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <button className="px-3 py-1" onClick={() => setQty(i.slug, i.qty + 1)}>+</button>
                    </div>
                    <button onClick={() => remove(i.slug)} className="text-xs text-plum/50 hover:text-rose">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="card h-fit p-7">
            <h2 className="font-serif text-2xl text-plum">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPKR(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping ? formatPKR(shipping) : "Free"}</dd></div>
              <div className="flex justify-between border-t border-blush-deep pt-3 font-serif text-xl text-plum"><dt>Total</dt><dd>{formatPKR(subtotal + shipping)}</dd></div>
            </dl>
            <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to checkout</Link>
            <p className="mt-3 text-center text-xs text-plum/60">Cash on delivery · Bank transfer · JazzCash · Easypaisa</p>
          </aside>
        </div>
      )}
    </section>
  );
}
