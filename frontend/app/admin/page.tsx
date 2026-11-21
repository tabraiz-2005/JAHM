"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPKR } from "@/lib/catalog";
import { listOrders, listProducts } from "@/lib/store";
import type { Order, Product } from "@/lib/types";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    listProducts().then(setProducts);
    listOrders().then(setOrders);
  }, []);

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "new").length;
  const lowStock = products.filter((p) => p.stock <= 1 && p.status === "active");
  const avg = orders.length ? Math.round(revenue / orders.length) : 0;

  const stats = [
    { l: "Revenue", v: formatPKR(revenue) },
    { l: "Orders", v: orders.length },
    { l: "Awaiting confirmation", v: pending },
    { l: "Avg. order value", v: formatPKR(avg) },
  ];

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="mt-2 font-serif text-4xl text-plum">Good to see you ✦</h1>
        <div className="flex gap-3">
          <Link href="/admin/content" className="btn-outline !px-5 !py-2.5">Edit homepage</Link>
          <Link href="/admin/products" className="btn-primary !px-5 !py-2.5">+ Add product</Link>
        </div>
      </div>
      {pending > 0 && (
        <Link href="/admin/orders" className="mt-6 flex items-center justify-between rounded-2xl bg-gold/15 px-6 py-4 text-sm text-plum hover:bg-gold/25">
          <span>🛎️ You have <b>{pending} new order{pending > 1 ? "s" : ""}</b> waiting for confirmation.</span>
          <span className="text-rose">Review →</span>
        </Link>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="card p-6">
            <p className="text-xs uppercase tracking-widest text-plum/50">{s.l}</p>
            <p className="mt-2 font-serif text-3xl text-plum">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-plum">Latest orders</h2>
            <Link href="/admin/orders" className="text-xs text-rose">View all →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-6 text-sm text-plum/60">No orders yet. Place a test order from the store checkout to see it here.</p>
          ) : (
            <ul className="mt-4 divide-y divide-blush">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <span><b className="text-plum">{o.id}</b> · {o.customer.name} · {o.customer.city}</span>
                  <span className="text-rose">{formatPKR(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-plum">Last pieces in stock</h2>
            <Link href="/admin/products" className="text-xs text-rose">Manage →</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {lowStock.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center gap-3 text-sm">
                <Image src={p.image} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
                <span className="flex-1 text-plum">{p.name}</span>
                <span className="rounded-full bg-blush px-3 py-1 text-xs text-rose">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
