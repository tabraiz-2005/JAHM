"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { backendOnline, listOrders, listProducts } from "@/lib/store";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/products", label: "Products", icon: "✦" },
  { href: "/admin/orders", label: "Orders", icon: "❖" },
  { href: "/admin/content", label: "Site Content", icon: "❀" },
];
const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "jahm2026";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [online, setOnline] = useState<boolean | null>(null);
  const [counts, setCounts] = useState({ newOrders: 0, orders: 0, products: 0 });

  useEffect(() => {
    setAuthed(sessionStorage.getItem("jahm-admin") === "1");
    backendOnline().then(setOnline);
  }, []);

  // Live counters for the sidebar — refresh on every page change and every 15 seconds
  useEffect(() => {
    if (!authed) return;
    const refresh = async () => {
      const [o, p] = await Promise.all([listOrders(), listProducts()]);
      setCounts({ newOrders: o.filter((x) => x.status === "new").length, orders: o.length, products: p.length });
    };
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [authed, path]);

  const badge = (href: string) => {
    if (href === "/admin/orders") return { n: counts.newOrders, total: counts.orders, alert: counts.newOrders > 0 };
    if (href === "/admin/products") return { n: counts.products, total: counts.products, alert: false };
    return null;
  };

  if (authed === null) return null;

  if (!authed)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blush-soft to-blush p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code === PASS) {
              sessionStorage.setItem("jahm-admin", "1");
              setAuthed(true);
            } else alert("Wrong passcode");
          }}
          className="card w-full max-w-sm p-8 text-center"
        >
          <Image src="/brand/logo.png" alt="JAHM" width={80} height={80} className="mx-auto rounded-full" />
          <h1 className="mt-4 font-serif text-3xl text-plum">Studio Admin</h1>
          <p className="mt-1 text-xs text-plum/60">Demo passcode is in .env.local</p>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Passcode" className="input mt-6" />
          <button className="btn-primary mt-4 w-full">Enter</button>
          <Link href="/" className="mt-4 block text-xs text-plum/60 hover:text-rose">← Back to store</Link>
        </form>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F8F3F1]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-plum p-6 text-blush md:flex">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="JAHM" width={44} height={44} className="rounded-full" />
          <div>
            <p className="font-serif text-xl tracking-[0.25em] text-white">JAHM</p>
            <p className="text-[10px] uppercase tracking-widest text-blush/60">Studio admin</p>
          </div>
        </Link>
        <nav className="mt-10 space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${path === n.href ? "bg-white/15 text-white" : "text-blush/70 hover:bg-white/10"}`}>
              <span className="text-gold-light">{n.icon}</span>
              <span className="flex-1">{n.label}</span>
              {(() => {
                const b = badge(n.href);
                if (!b) return null;
                return b.alert ? (
                  <span className="flex items-center gap-1.5" title={`${b.n} new · ${b.total} total`}>
                    <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" /></span>
                    <span className="min-w-[22px] rounded-full bg-gold px-2 py-0.5 text-center text-[11px] font-semibold text-plum">{b.n} new</span>
                  </span>
                ) : (
                  <span className="min-w-[22px] rounded-full bg-white/15 px-2 py-0.5 text-center text-[11px] text-blush">{b.total}</span>
                );
              })()}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3 text-xs">
          <p className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${online ? "bg-green-400" : "bg-amber-400"}`} />
            {online === null ? "Checking API…" : online ? "Python API connected" : "Offline mode (browser storage)"}
          </p>
          <Link href="/" target="_blank" className="block text-blush/70 hover:text-white">View store ↗</Link>
          <button onClick={() => { sessionStorage.removeItem("jahm-admin"); location.reload(); }} className="text-blush/70 hover:text-white">Log out</button>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex gap-2 overflow-x-auto bg-plum p-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs ${path === n.href ? "bg-white text-plum" : "text-blush"}`}>
              {n.label}
              {n.href === "/admin/orders" && counts.newOrders > 0 && <span className="ml-1.5 rounded-full bg-gold px-1.5 text-[10px] font-semibold text-plum">{counts.newOrders}</span>}
            </Link>
          ))}
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
