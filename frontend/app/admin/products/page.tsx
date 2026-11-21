"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, categoryName, formatPKR } from "@/lib/catalog";
import { deleteProduct, listProducts, saveProduct } from "@/lib/store";
import ImageField from "@/components/admin/ImageField";
import type { Product } from "@/lib/types";

const blank = (): Product => ({
  id: "p" + Date.now(),
  slug: "",
  name: "",
  category: "trays",
  price: 4000,
  compareAtPrice: null,
  image: "",
  tagline: "",
  description: "",
  details: [],
  dimensions: "",
  oneOfAKind: true,
  featured: false,
  bestseller: false,
  stock: 1,
  status: "active",
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [edit, setEdit] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => { listProducts().then(setItems); }, []);

  const shown = useMemo(
    () => items.filter((p) => (!cat || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())),
    [items, q, cat]
  );

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const p = { ...edit, slug: edit.slug || slugify(edit.name) };
    setItems(await saveProduct(p));
    setEdit(null);
  }

  async function onDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    setItems(await deleteProduct(p.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-2 font-serif text-4xl text-plum">Products</h1>
        </div>
        <button onClick={() => setEdit(blank())} className="btn-primary">+ Add product</button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="input max-w-xs" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input max-w-[200px]">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          <option value="gift-sets">Gift Sets</option>
        </select>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-blush text-xs uppercase tracking-widest text-plum/50">
            <tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Tags</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-blush">
            {shown.map((p) => (
              <tr key={p.id} className="hover:bg-blush-soft/60">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {p.image ? <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <div className="h-12 w-12 rounded-lg bg-blush" />}
                    <span className="font-medium text-plum">{p.name}</span>
                  </div>
                </td>
                <td>{categoryName(p.category)}</td>
                <td>{formatPKR(p.price)}</td>
                <td><span className={p.stock <= 0 ? "text-rose" : ""}>{p.stock}</span></td>
                <td><span className={`rounded-full px-3 py-1 text-xs ${p.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{p.status}</span></td>
                <td className="text-xs text-plum/60">{[p.featured && "Featured", p.bestseller && "Bestseller", p.oneOfAKind && "1 of 1"].filter(Boolean).join(" · ")}</td>
                <td className="p-4 text-right">
                  <button onClick={() => setEdit(p)} className="mr-3 text-rose hover:underline">Edit</button>
                  <button onClick={() => onDelete(p)} className="text-plum/50 hover:text-rose">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-plum/50 p-4 md:p-10">
          <form onSubmit={onSave} className="card w-full max-w-3xl p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl text-plum">{items.some((x) => x.id === edit.id) ? "Edit product" : "New product"}</h2>
              <button type="button" onClick={() => setEdit(null)} className="text-2xl text-plum/50">×</button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2"><label className="label">Name *</label><input required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div><label className="label">URL slug</label><input className="input" value={edit.slug} placeholder={slugify(edit.name) || "auto"} onChange={(e) => setEdit({ ...edit, slug: slugify(e.target.value) })} /></div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as Product["category"] })}>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  <option value="gift-sets">Gift Sets</option>
                </select>
              </div>
              <div><label className="label">Price (PKR) *</label><input required type="number" min={0} className="input" value={edit.price} onChange={(e) => setEdit({ ...edit, price: +e.target.value })} /></div>
              <div><label className="label">Compare-at price (optional)</label><input type="number" min={0} className="input" value={edit.compareAtPrice ?? ""} onChange={(e) => setEdit({ ...edit, compareAtPrice: e.target.value ? +e.target.value : null })} /></div>
              <div><label className="label">Stock</label><input type="number" min={0} className="input" value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: +e.target.value })} /></div>
              <div><label className="label">Size / dimensions</label><input className="input" value={edit.dimensions} onChange={(e) => setEdit({ ...edit, dimensions: e.target.value })} /></div>
              <div className="md:col-span-2"><label className="label">Tagline</label><input className="input" value={edit.tagline} onChange={(e) => setEdit({ ...edit, tagline: e.target.value })} /></div>
              <div className="md:col-span-2"><label className="label">Description</label><textarea rows={4} className="input" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
              <div className="md:col-span-2"><label className="label">Details (one per line)</label><textarea rows={3} className="input" value={edit.details.join("\n")} onChange={(e) => setEdit({ ...edit, details: e.target.value.split("\n").filter(Boolean) })} /></div>
              <div className="md:col-span-2">
                <ImageField label="Product photo" tall value={edit.image} onChange={(image) => setEdit({ ...edit, image })} />
              </div>
              <div className="flex flex-wrap gap-5 text-sm md:col-span-2">
                {(["oneOfAKind", "featured", "bestseller"] as const).map((k) => (
                  <label key={k} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-rose" checked={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.checked })} />
                    {{ oneOfAKind: "One of a kind", featured: "Featured", bestseller: "Bestseller" }[k]}
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-rose" checked={edit.status === "active"} onChange={(e) => setEdit({ ...edit, status: e.target.checked ? "active" : "draft" })} />
                  Visible in store
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setEdit(null)} className="btn-outline">Cancel</button>
              <button className="btn-primary">Save product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
