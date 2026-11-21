# JAHM Studio — Just A Handmade Magic 🎨

Premium e-commerce site for hand-painted décor.
**Frontend:** Next.js 14 + Tailwind · **Backend:** Python FastAPI · **Storage:** `backend/data/db.json` (real database coming next)

```
jahm-studio/
├── frontend/          Next.js storefront + /admin panel
│   ├── app/(store)/   Home, Shop, Product, Cart, Checkout, Custom Orders, About
│   ├── app/admin/     Dashboard, Products, Orders, Site Content (homepage editor)
│   ├── components/    Header, Footer, CartDrawer, ProductCard …
│   ├── lib/           catalog.ts (product data/API), store.ts (orders/admin API), types.ts
│   ├── data/          products.json (seed catalogue — edit prices/text here)
│   └── public/        products/ (photos), brand/logo.png
├── backend/           FastAPI API (main.py) + data/products.json
└── PROMPT.md          The full build brief
```

## Requirements
- **Node.js 18.17+** (20 LTS recommended): https://nodejs.org
- **Python 3.10+**: https://python.org
- VS Code

## Run it in VS Code

Unzip, then **File → Open Folder → `jahm-studio`**. Open two terminals (**Terminal → New Terminal**, then the **+** button).

### Terminal 1 — Backend (Python API)
**Windows**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
**Mac / Linux**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

### Terminal 2 — Frontend (website)
```bash
cd frontend
npm install
npm run dev
```
Website: **http://localhost:3000** · Admin: **http://localhost:3000/admin** (passcode `jahm2026`)

> The website also works **without** the backend (it uses the local seed data and saves test orders in the browser).
> With the backend running, products, orders and homepage content are saved in `backend/data/db.json` and uploaded
> photos in `backend/uploads/`, so they survive restarts.
> **To reset everything to the original demo data:** stop the backend and delete `backend/data/db.json`.

## Admin features
- **Dashboard**: revenue, orders and stock, plus an alert when new orders arrive
- **Sidebar badges**: product count and a gold "N new" badge on Orders (refreshes every 15 seconds)
- **Products**: add, edit and delete products and upload photos
- **Orders**: change status (new → confirmed → shipped → delivered) and confirm with the customer on WhatsApp
- **Site Content**: edit the hero slideshow (images, headlines, buttons, featured product, speed, slide order),
  the collection circles and the section images. Requires the backend to be running.

## Settings — `frontend/.env.local`
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (default `http://localhost:8000`) |
| `NEXT_PUBLIC_WHATSAPP` | Your WhatsApp number, e.g. `923001234567`. **Replace the placeholder!** |
| `NEXT_PUBLIC_ADMIN_PASSCODE` | Demo admin passcode (not real security) |

Restart `npm run dev` after editing `.env.local`.

## Editing products
Edit `frontend/data/products.json` **and** `backend/data/products.json` (same file). Add photos to
`frontend/public/products/`. Sizes in the descriptions are approximate placeholders: measure your pieces and update them.

## Before going live (to-do)
- [ ] Real database (PostgreSQL / Supabase)
- [ ] Real admin login (the passcode is demo-only)
- [ ] Image hosting for admin uploads
- [ ] Real WhatsApp number, Instagram/Facebook/TikTok links in `components/Footer.tsx`
- [ ] Professional product photos (plain background + lifestyle shots)
- [ ] Add **real** customer reviews once you have them
