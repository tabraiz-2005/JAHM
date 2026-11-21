import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="mt-24 bg-plum text-blush">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="JAHM" width={56} height={56} className="rounded-full" />
            <div>
              <div className="font-serif text-2xl tracking-[0.3em] text-white">JAHM</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-blush/70">Just A Handmade Magic</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-blush/70">
            Hand-painted décor and gifts, made by student artists in Pakistan. Every brushstroke is real.
          </p>
          <div className="mt-5 flex gap-4">
            <a href="https://instagram.com/jahmstudio.official" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white"><InstagramIcon /></a>
            <a href="#" aria-label="Facebook" className="hover:text-white"><FacebookIcon /></a>
            <a href="#" aria-label="TikTok" className="hover:text-white"><TikTokIcon /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.25em] text-gold-light">Shop</h4>
          <ul className="space-y-2 text-sm text-blush/80">
            <li><Link href="/shop" className="hover:text-white">All Pieces</Link></li>
            <li><Link href="/shop?category=art-decks" className="hover:text-white">Art Decks</Link></li>
            <li><Link href="/shop?category=lanterns" className="hover:text-white">Lanterns</Link></li>
            <li><Link href="/shop?category=trays" className="hover:text-white">Art Trays</Link></li>
            <li><Link href="/shop?category=planters" className="hover:text-white">Planters</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.25em] text-gold-light">Help</h4>
          <ul className="space-y-2 text-sm text-blush/80">
            <li><Link href="/custom-orders" className="hover:text-white">Custom Orders</Link></li>
            <li><Link href="/about#shipping" className="hover:text-white">Shipping & Delivery</Link></li>
            <li><Link href="/about#care" className="hover:text-white">Care Guide</Link></li>
            <li><Link href="/about#faq" className="hover:text-white">FAQs</Link></li>
            <li><Link href="/about" className="hover:text-white">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.25em] text-gold-light">Join the studio list</h4>
          <p className="text-sm text-blush/70">New drops sell out fast. Be the first to see them.</p>
          <form className="mt-4 flex overflow-hidden rounded-full bg-white/10">
            <input type="email" placeholder="Your email" className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-blush/50 outline-none" />
            <button type="button" className="bg-rose px-5 text-xs uppercase tracking-widest text-white hover:bg-rose-dark">Join</button>
          </form>
          <p className="mt-6 text-xs text-blush/60">Payments: Cash on Delivery · Bank Transfer · JazzCash · Easypaisa</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-blush/50">
        © {new Date().getFullYear()} JAHM Studio. All rights reserved. Made with love & a splash of colour.
      </div>
    </footer>
  );
}
