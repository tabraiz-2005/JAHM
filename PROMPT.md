# Build prompt — JAHM Studio e-commerce (v0.1)

Use this prompt to continue / regenerate the project with Claude.

---

**Role:** You are a senior full-stack developer and luxury e-commerce designer.

**Brand:** JAHM — *Just A Handmade Magic* (Instagram: @jahmstudio.official). A Pakistani student-run studio selling
hand-painted, mostly one-of-a-kind home décor and gifts.

**Brand palette (from the logo):** dusty rose `#A3545C` (primary), deep rose `#86404A`, blush `#F7E4E4` / `#FBEFEF`,
cream `#FCF8F6` (background), plum `#5A2B35` (footer/dark), gold accent `#C29B57` (echoes the real gold leaf on products).
**Typography:** Cormorant Garamond (headings), Jost (body), Great Vibes (script accents).
**Mood:** elegant, feminine, artsy, premium. Style reference: soft beauty-brand storefronts (announcement bar, hero with
product collage, trust bar, circular category tiles, bestseller grid, promo banner, footer with newsletter).

**Stack:**
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Python FastAPI (in-memory store for now; database to be added later — PostgreSQL/Supabase)
- Frontend must still work with no backend running (fallback to local seed data + localStorage).

**Products (PKR, premium, from Rs 4,000):**
Art Decks (Koi Pond 14,500 · Hibiscus & Bone 12,000), Lanterns (Lavender Hurricane 6,800 · Vintage Bloom 5,500),
Art Trays (Crimson Silhouette 7,500 · Afternoon Tea 6,500 · Blush Bloom 6,000), Planters (Noir Gilded 4,800 ·
Lavender Honey 4,500 · Cerulean Cherry 4,200). Do NOT include designs based on copyrighted characters (e.g. Spider-Man).

**Storefront pages:** Home, Shop (filter/sort/search), Product detail, Cart (slide-out drawer + page), Checkout
(Cash on Delivery / bank transfer, Pakistani phone validation, city list), Custom Orders (WhatsApp request), Our Story
(+ shipping, care, FAQ).

**Conversion features (honest only — no fake reviews, fake timers or fake "X people viewing"):**
"One of a kind" badges with real stock, free-delivery progress bar (free over Rs 8,000, else Rs 250), Buy-it-now,
COD everywhere, free gift wrap + handwritten note, floating WhatsApp button, related products, custom-order CTA.

**Admin (/admin):** passcode gate (demo only), dashboard stats, product CRUD with image upload, order list with status
workflow (new → confirmed → shipped → delivered / cancelled) and WhatsApp confirm link. API status indicator.

**Backend API:** `/api/health`, `/api/products`, `/api/products/{slug}`, `POST /api/orders` (server re-prices items and
checks stock), `/api/admin/products` (GET/POST/PUT/DELETE), `/api/admin/orders` (GET/PATCH).

**Next phases:** 1) real database, 2) real admin auth, 3) image storage (Cloudinary/S3), 4) courier integration
(PostEx/Trax/Leopards), 5) email/WhatsApp order notifications, 6) analytics + Meta Pixel, 7) deployment (Vercel + Render/Railway).
