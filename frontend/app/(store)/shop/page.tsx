import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, categoryName, getProducts } from "@/lib/catalog";

export const metadata = { title: "Shop" };

const SORTS = [
  { v: "featured", l: "Featured" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
];

export default async function ShopPage({ searchParams }: { searchParams: { category?: string; sort?: string; q?: string } }) {
  const all = await getProducts();
  const { category, sort = "featured", q = "" } = searchParams;
  let list = category ? all.filter((p) => p.category === category) : all;
  if (q) {
    const s = q.toLowerCase();
    list = list.filter((p) => (p.name + " " + p.tagline + " " + p.description).toLowerCase().includes(s));
  }
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));

  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const m = { category, sort, q, ...o };
    Object.entries(m).forEach(([k, v]) => v && p.set(k, v));
    return `/shop?${p.toString()}`;
  };

  return (
    <>
      <section className="bg-gradient-to-b from-blush-soft to-cream py-16 text-center">
        <p className="eyebrow">The Collection</p>
        <h1 className="section-title mt-3">{category ? categoryName(category) : "Shop all pieces"}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-plum/70">Hand-painted, one at a time. Most pieces are one of a kind.</p>
      </section>

      <section className="container-x">
        <div className="flex flex-col gap-5 border-b border-blush-deep pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link href={qs({ category: undefined })} className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition ${!category ? "bg-rose text-white" : "bg-white text-plum hover:bg-blush"}`}>All</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={qs({ category: c.slug })} className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition ${category === c.slug ? "bg-rose text-white" : "bg-white text-plum hover:bg-blush"}`}>{c.name}</Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <form action="/shop" className="flex">
              {category && <input type="hidden" name="category" value={category} />}
              <input name="q" defaultValue={q} placeholder="Search pieces…" className="input !rounded-full !py-2" />
            </form>
            <div className="flex gap-1 text-xs">
              {SORTS.map((s) => (
                <Link key={s.v} href={qs({ sort: s.v })} className={`rounded-full px-3 py-2 ${sort === s.v ? "text-rose underline" : "text-plum/70 hover:text-rose"}`}>{s.l}</Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-widest text-plum/50">{list.length} pieces</p>
        {list.length === 0 ? (
          <p className="py-24 text-center font-serif text-2xl text-plum">No pieces found. Try another collection.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
