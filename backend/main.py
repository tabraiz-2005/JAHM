"""
JAHM Studio — Python API (FastAPI)

Current stage: simple FILE storage in data/db.json (created on first run,
seeded from data/products.json + data/settings.json). Uploaded images are
saved in uploads/. Delete data/db.json to reset everything to the seed data.
A real database (PostgreSQL / Supabase) will replace the `db` object later
without changing any of the API routes the frontend calls.

Run:  uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""
from __future__ import annotations

import json
import random
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Literal, Optional

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# ---------------------------------------------------------------- models
Category = Literal["art-decks", "lanterns", "trays", "planters", "gift-sets"]
OrderStatus = Literal["new", "confirmed", "shipped", "delivered", "cancelled"]


class Product(BaseModel):
    id: str
    slug: str
    name: str
    category: Category
    price: int = Field(ge=0)
    compareAtPrice: Optional[int] = None
    image: str
    tagline: str = ""
    description: str = ""
    details: List[str] = []
    dimensions: str = ""
    oneOfAKind: bool = False
    featured: bool = False
    bestseller: bool = False
    stock: int = Field(ge=0, default=1)
    status: Literal["active", "draft"] = "active"


class CartItem(BaseModel):
    slug: str
    name: str
    price: int
    image: str
    qty: int = Field(ge=1)
    giftWrap: Optional[bool] = False


class Customer(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    city: str
    address: str
    notes: Optional[str] = ""


class OrderIn(BaseModel):
    customer: Customer
    items: List[CartItem]
    subtotal: int
    shipping: int
    total: int
    paymentMethod: Literal["cod", "bank"]


class Order(OrderIn):
    id: str
    createdAt: str
    status: OrderStatus = "new"


class StatusUpdate(BaseModel):
    status: OrderStatus


class HeroSlide(BaseModel):
    image: str
    eyebrow: str = ""
    title: str = ""
    highlight: str = ""
    subtitle: str = ""
    productSlug: Optional[str] = ""
    ctaLabel: str = "Shop now"
    ctaHref: str = "/shop"


class Hero(BaseModel):
    autoplaySeconds: int = Field(ge=2, le=30, default=6)
    slides: List[HeroSlide]


class Sections(BaseModel):
    bannerImage: str
    customOrderImage: str


class SiteSettings(BaseModel):
    hero: Hero
    categoryImages: dict[str, str]
    sections: Sections


# ---------------------------------------------------------------- "database"
DATA = Path(__file__).parent / "data"
DB_FILE = DATA / "db.json"
UPLOADS = Path(__file__).parent / "uploads"
UPLOADS.mkdir(exist_ok=True)
FREE_SHIPPING_THRESHOLD = 8000
SHIPPING_FEE = 250


class FileDB:
    """Temporary JSON-file store. Swap for a real database later."""

    def __init__(self) -> None:
        if DB_FILE.exists():
            raw = json.loads(DB_FILE.read_text(encoding="utf-8"))
        else:
            raw = {
                "products": json.loads((DATA / "products.json").read_text(encoding="utf-8")),
                "orders": [],
                "settings": json.loads((DATA / "settings.json").read_text(encoding="utf-8")),
            }
        self.products: dict[str, Product] = {p["id"]: Product(**p) for p in raw["products"]}
        self.orders: dict[str, Order] = {o["id"]: Order(**o) for o in raw["orders"]}
        self.settings = SiteSettings(**raw["settings"])
        self.save()

    def save(self) -> None:
        DB_FILE.write_text(
            json.dumps(
                {
                    "products": [p.model_dump() for p in self.products.values()],
                    "orders": [o.model_dump() for o in self.orders.values()],
                    "settings": self.settings.model_dump(),
                },
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )


db = FileDB()

# ---------------------------------------------------------------- app
app = FastAPI(title="JAHM Studio API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=UPLOADS), name="uploads")


@app.get("/api/health")
def health():
    return {"status": "ok", "products": len(db.products), "orders": len(db.orders)}


# ---- public storefront
@app.get("/api/products", response_model=List[Product])
def public_products(category: Optional[Category] = None):
    items = [p for p in db.products.values() if p.status == "active"]
    if category:
        items = [p for p in items if p.category == category]
    return items


@app.get("/api/products/{slug}", response_model=Product)
def public_product(slug: str):
    for p in db.products.values():
        if p.slug == slug and p.status == "active":
            return p
    raise HTTPException(404, "Product not found")


@app.post("/api/orders", response_model=Order, status_code=201)
def create_order(data: OrderIn):
    if not data.items:
        raise HTTPException(400, "Cart is empty")
    # Re-price on the server so totals can't be tampered with in the browser.
    subtotal = 0
    by_slug = {p.slug: p for p in db.products.values()}
    for item in data.items:
        prod = by_slug.get(item.slug)
        if not prod or prod.status != "active":
            raise HTTPException(400, f"'{item.name}' is no longer available")
        if prod.stock < item.qty:
            raise HTTPException(409, f"Only {prod.stock} of '{prod.name}' left")
        item.price = prod.price
        subtotal += prod.price * item.qty
    shipping = 0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FEE
    for item in data.items:
        by_slug[item.slug].stock -= item.qty

    order = Order(
        **{**data.model_dump(), "subtotal": subtotal, "shipping": shipping, "total": subtotal + shipping},
        id=f"JAHM-{random.randint(100000, 999999)}",
        createdAt=datetime.now(timezone.utc).isoformat(),
    )
    db.orders[order.id] = order
    db.save()
    return order


# ---- admin (TODO: protect with real authentication before going live)
@app.get("/api/admin/products", response_model=List[Product])
def admin_products():
    return list(db.products.values())


@app.post("/api/admin/products", response_model=Product, status_code=201)
def admin_create_product(p: Product):
    if any(x.slug == p.slug for x in db.products.values()):
        raise HTTPException(409, "A product with this slug already exists")
    db.products = {p.id: p, **db.products}
    db.save()
    return p


@app.put("/api/admin/products/{pid}", response_model=Product)
def admin_update_product(pid: str, p: Product):
    if pid not in db.products:
        raise HTTPException(404, "Product not found")
    db.products[pid] = p
    db.save()
    return p


@app.delete("/api/admin/products/{pid}")
def admin_delete_product(pid: str):
    if db.products.pop(pid, None) is None:
        raise HTTPException(404, "Product not found")
    db.save()
    return {"ok": True}


@app.get("/api/admin/orders", response_model=List[Order])
def admin_orders():
    return sorted(db.orders.values(), key=lambda o: o.createdAt, reverse=True)


@app.patch("/api/admin/orders/{oid}", response_model=Order)
def admin_update_order(oid: str, body: StatusUpdate):
    order = db.orders.get(oid)
    if not order:
        raise HTTPException(404, "Order not found")
    order.status = body.status
    db.save()
    return order


# ---- site content (homepage images & text)
@app.get("/api/settings", response_model=SiteSettings)
def get_settings():
    return db.settings


@app.put("/api/admin/settings", response_model=SiteSettings)
def update_settings(body: SiteSettings):
    if not body.hero.slides:
        raise HTTPException(400, "Add at least one hero slide")
    db.settings = body
    db.save()
    return body


ALLOWED = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


@app.post("/api/admin/upload")
async def upload_image(request: Request, file: UploadFile = File(...)):
    ext = ALLOWED.get(file.content_type or "")
    if not ext:
        raise HTTPException(400, "Only JPG, PNG or WEBP images are allowed")
    data = await file.read()
    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(413, "Image must be under 8 MB")
    name = f"{uuid.uuid4().hex[:12]}{ext}"
    (UPLOADS / name).write_bytes(data)
    return {"url": f"{str(request.base_url).rstrip('/')}/uploads/{name}"}
