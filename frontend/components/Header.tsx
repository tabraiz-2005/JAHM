"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=art-decks", label: "Art Decks" },
  { href: "/shop?category=lanterns", label: "Lanterns" },
  { href: "/shop?category=trays", label: "Trays" },
  { href: "/shop?category=planters", label: "Planters" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/about", label: "Our Story" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className={`sticky top-0 z-40 bg-cream/90 backdrop-blur transition-shadow ${scrolled ? "shadow-soft" : ""}`}>
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <button className="text-plum lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
          <MenuIcon />
        </button>

        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="JAHM Studio" width={52} height={52} className="rounded-full" priority />
          <div className="hidden leading-none sm:block">
            <div className="font-serif text-2xl tracking-[0.3em] text-plum">JAHM</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-rose">Just A Handmade Magic</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.slice(0, 2).concat(NAV.slice(6)).map((n) => (
            <Link key={n.href} href={n.href} className={`text-[13px] uppercase tracking-[0.16em] transition hover:text-rose ${pathname === n.href ? "text-rose" : "text-plum"}`}>
              {n.label}
            </Link>
          ))}
          <div className="group relative">
            <span className="cursor-default text-[13px] uppercase tracking-[0.16em] text-plum">Collections ▾</span>
            <div className="invisible absolute left-1/2 top-full w-52 -translate-x-1/2 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="card p-3">
                {NAV.slice(2, 6).map((n) => (
                  <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 text-sm text-plum hover:bg-blush-soft hover:text-rose">
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-4 text-plum">
          <Link href="/shop" aria-label="Search products" className="hover:text-rose"><SearchIcon /></Link>
          <button onClick={() => setOpen(true)} className="relative hover:text-rose" aria-label="Open cart">
            <BagIcon className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-plum/40 transition-opacity ${menu ? "opacity-100" : "opacity-0"}`} onClick={() => setMenu(false)} />
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-cream p-6 transition-transform ${menu ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-8 flex items-center justify-between">
            <span className="font-serif text-2xl tracking-[0.3em] text-plum">JAHM</span>
            <button onClick={() => setMenu(false)} aria-label="Close menu" className="text-plum"><CloseIcon /></button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-3 font-serif text-xl text-plum hover:bg-blush-soft">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
