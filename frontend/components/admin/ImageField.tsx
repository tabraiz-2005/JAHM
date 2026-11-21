"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { uploadImage } from "@/lib/store";

const LIBRARY = [
  "/products/koi-pond-deck.jpg",
  "/products/hibiscus-skull-deck.jpg",
  "/products/lavender-hurricane-lantern.jpg",
  "/products/vintage-bloom-lantern.jpg",
  "/products/crimson-silhouette-tray.jpg",
  "/products/afternoon-tea-tray.jpg",
  "/products/blush-bloom-tray.jpg",
  "/products/noir-gilded-planter.jpg",
  "/products/lavender-honey-planter.jpg",
  "/products/cerulean-cherry-planter.jpg",
];

/** Image picker: upload a new photo, choose from existing product photos, or paste a URL. */
export default function ImageField({
  value,
  onChange,
  label,
  tall = false,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  tall?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [lib, setLib] = useState(false);

  async function pick(f?: File) {
    if (!f) return;
    setBusy(true);
    try {
      onChange(await uploadImage(f));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setBusy(false);
  }

  return (
    <div>
      {label && <p className="label">{label}</p>}
      <div className="flex gap-4">
        <div
          onClick={() => input.current?.click()}
          className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-xl bg-blush ${tall ? "h-40 w-32" : "h-24 w-24"}`}
          title="Click to upload"
        >
          {value && <img src={value} alt="" className="h-full w-full object-cover" />}
          <span className="absolute inset-0 flex items-center justify-center bg-plum/50 text-xs font-medium uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
            {busy ? "Uploading…" : "Replace"}
          </span>
          {busy && <span className="absolute inset-0 flex items-center justify-center bg-plum/60 text-xs text-white">Uploading…</span>}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => input.current?.click()} className="rounded-full bg-rose px-4 py-2 text-xs uppercase tracking-wider text-white hover:bg-rose-dark">Upload photo</button>
            <button type="button" onClick={() => setLib(!lib)} className="rounded-full border border-rose px-4 py-2 text-xs uppercase tracking-wider text-rose hover:bg-blush">
              {lib ? "Close library" : "Choose existing"}
            </button>
          </div>
          <input
            className="input !py-2 text-xs"
            placeholder="…or paste an image URL"
            value={value.startsWith("data:") ? "(uploaded image)" : value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {lib && (
        <div className="mt-3 grid grid-cols-5 gap-2 rounded-xl bg-blush-soft p-3">
          {LIBRARY.map((src) => (
            <button
              type="button"
              key={src}
              onClick={() => { onChange(src); setLib(false); }}
              className={`aspect-square overflow-hidden rounded-lg border-2 ${value === src ? "border-rose" : "border-transparent"}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}
