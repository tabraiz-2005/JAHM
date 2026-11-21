"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export default function AddToCart({ p }: { p: Product }) {
  const { add, setOpen } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const max = Math.max(1, p.stock);
  const soldOut = p.stock <= 0;
  const item = { slug: p.slug, name: p.name, price: p.price, image: p.image };

  if (soldOut)
    return <button disabled className="btn w-full cursor-not-allowed bg-plum/20 text-plum">Sold out. Ask us for a custom one</button>;

  return (
    <div className="space-y-3">
      {!p.oneOfAKind && (
        <div className="flex w-fit items-center rounded-full border border-blush-deep bg-white">
          <button className="px-4 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span className="w-8 text-center">{qty}</span>
          <button className="px-4 py-2" onClick={() => setQty(Math.min(max, qty + 1))}>+</button>
        </div>
      )}
      <button onClick={() => add(item, qty)} className="btn-primary w-full">Add to bag</button>
      <button
        onClick={() => {
          add(item, qty);
          setOpen(false);
          router.push("/checkout");
        }}
        className="btn-outline w-full"
      >
        Buy it now · Cash on Delivery
      </button>
    </div>
  );
}
