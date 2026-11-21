import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Our Story" };

const FAQ = [
  ["Are the pieces really hand-painted?", "Yes. Every design is painted by hand by our artists. Nothing is printed, which is why no two pieces are exactly alike."],
  ["How long does delivery take?", "3–5 working days to major cities, 5–7 days elsewhere in Pakistan. Custom orders take 7–14 days to paint before dispatch."],
  ["Do you offer cash on delivery?", "Yes, cash on delivery is available nationwide. You can also pay by bank transfer, JazzCash or Easypaisa."],
  ["What if my item arrives damaged?", "We pack every piece with care, but if anything arrives damaged, send us a photo on WhatsApp within 48 hours and we'll make it right."],
  ["Can I order something personalised?", "Absolutely. Visit our Custom Orders page and share your idea. We'll send a sketch before we paint."],
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x grid items-center gap-12 py-20 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
          <Image src="/products/noir-gilded-planter.jpg" alt="JAHM studio" fill sizes="50vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="section-title mt-3">Just A Handmade <em className="font-script font-normal text-rose">Magic</em></h1>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-plum/80">
            <p>JAHM began in a university studio with a few brushes, a lot of paint and a simple belief: the things you live with every day should make you feel something.</p>
            <p>We take everyday objects like lanterns, trays, planters and skateboard decks and turn them into one-of-a-kind art. Every piece is sketched, painted, sealed and wrapped by hand.</p>
            <p>When you buy from JAHM you&apos;re not buying a product off a shelf. You&apos;re supporting young Pakistani artists and bringing home something that exists nowhere else.</p>
          </div>
          <Link href="/shop" className="btn-primary mt-8">Shop the collection</Link>
        </div>
      </section>

      <section id="shipping" className="bg-blush-soft py-20">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="section-title">Shipping & delivery</h2>
            <ul className="mt-6 space-y-3 text-sm text-plum/80">
              <li>✦ Nationwide delivery across Pakistan</li>
              <li>✦ Free delivery on orders over Rs 8,000 (otherwise Rs 250)</li>
              <li>✦ Cash on delivery available everywhere</li>
              <li>✦ Every order gift-wrapped with a handwritten note</li>
            </ul>
          </div>
          <div id="care">
            <h2 className="section-title">Care guide</h2>
            <ul className="mt-6 space-y-3 text-sm text-plum/80">
              <li>✦ Wipe with a soft, dry or slightly damp cloth</li>
              <li>✦ Don&apos;t soak painted surfaces or put them in a dishwasher</li>
              <li>✦ Keep out of long periods of harsh direct sunlight</li>
              <li>✦ Use LED candles in lanterns indoors</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="container-x py-20">
        <h2 className="section-title text-center">Frequently asked</h2>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card p-6">
              <summary className="cursor-pointer list-none font-serif text-xl text-plum">{q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-plum/75">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
