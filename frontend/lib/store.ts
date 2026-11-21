"use client";
/**
 * Client-side data layer used by checkout + admin.
 * Talks to the FastAPI backend when available; otherwise stores data in
 * localStorage so the whole site can be tested without a database.
 * When the real database is added, only the backend changes — this file stays.
 */
import { DEFAULT_SETTINGS, SEED_PRODUCTS } from "./catalog";
import type { Order, Product, SiteSettings } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL;
const PKEY = "jahm-admin-products";
const OKEY = "jahm-orders";

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!API) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function backendOnline(): Promise<boolean> {
  return (await api<{ status: string }>("/api/health")) !== null;
}

// ---------- Products ----------
export async function listProducts(): Promise<Product[]> {
  const remote = await api<Product[]>("/api/admin/products");
  if (remote) return remote;
  return readLocal<Product[]>(PKEY, SEED_PRODUCTS);
}

export async function saveProduct(p: Product): Promise<Product[]> {
  const exists = (await listProducts()).some((x) => x.id === p.id);
  const remote = exists
    ? await api<Product>(`/api/admin/products/${p.id}`, { method: "PUT", body: JSON.stringify(p) })
    : await api<Product>(`/api/admin/products`, { method: "POST", body: JSON.stringify(p) });
  if (remote) return listProducts();
  const local = readLocal<Product[]>(PKEY, SEED_PRODUCTS);
  const next = exists ? local.map((x) => (x.id === p.id ? p : x)) : [p, ...local];
  writeLocal(PKEY, next);
  return next;
}

export async function deleteProduct(id: string): Promise<Product[]> {
  const remote = await api<{ ok: boolean }>(`/api/admin/products/${id}`, { method: "DELETE" });
  if (remote) return listProducts();
  const next = readLocal<Product[]>(PKEY, SEED_PRODUCTS).filter((x) => x.id !== id);
  writeLocal(PKEY, next);
  return next;
}

// ---------- Orders ----------
export async function createOrder(o: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const remote = await api<Order>("/api/orders", { method: "POST", body: JSON.stringify(o) });
  if (remote) return remote;
  const order: Order = {
    ...o,
    id: "JAHM-" + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  writeLocal(OKEY, [order, ...readLocal<Order[]>(OKEY, [])]);
  return order;
}

export async function listOrders(): Promise<Order[]> {
  const remote = await api<Order[]>("/api/admin/orders");
  if (remote) return remote;
  return readLocal<Order[]>(OKEY, []);
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order[]> {
  const remote = await api<Order>(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  if (remote) return listOrders();
  const next = readLocal<Order[]>(OKEY, []).map((o) => (o.id === id ? { ...o, status } : o));
  writeLocal(OKEY, next);
  return next;
}

// ---------- Site content ----------
export async function loadSettings(): Promise<SiteSettings> {
  return (await api<SiteSettings>("/api/settings")) ?? DEFAULT_SETTINGS;
}

export async function saveSettings(s: SiteSettings): Promise<SiteSettings | null> {
  return api<SiteSettings>("/api/admin/settings", { method: "PUT", body: JSON.stringify(s) });
}

/** Uploads an image to the Python API; falls back to an inline data URL when offline. */
export async function uploadImage(file: File): Promise<string> {
  if (API) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/api/admin/upload`, { method: "POST", body: fd });
      if (res.ok) return ((await res.json()) as { url: string }).url;
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Upload failed");
    } catch (e) {
      if (e instanceof Error && e.message !== "Failed to fetch") throw e;
    }
  }
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(file);
  });
}
