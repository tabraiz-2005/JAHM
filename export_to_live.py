"""
Export to live site: copies homepage slides, collection/section images and products
(including uploaded photos) from the local admin into the frontend code, so the live
Vercel site shows them without the backend.

Usage:  python3 export_to_live.py  ->  git add . && git commit -m "Update homepage" && git push
"""
import base64
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DB = ROOT / "backend" / "data" / "db.json"
UPLOADS = ROOT / "backend" / "uploads"
PUBLIC_UPLOADS = ROOT / "frontend" / "public" / "uploads"
PREFIXES = ("http://localhost:8000/uploads/", "http://127.0.0.1:8000/uploads/")
EXT = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
copied = 0


def fix(value):
    global copied
    if isinstance(value, dict):
        return {k: fix(v) for k, v in value.items()}
    if isinstance(value, list):
        return [fix(v) for v in value]
    if not isinstance(value, str):
        return value
    for prefix in PREFIXES:
        if value.startswith(prefix):
            name = value[len(prefix):]
            src = UPLOADS / name
            if not src.exists():
                print(f"  ! missing upload {name} (kept original URL)")
                return value
            shutil.copy2(src, PUBLIC_UPLOADS / name)
            copied += 1
            return f"/uploads/{name}"
    if value.startswith("data:image/"):
        header, b64 = value.split(",", 1)
        mime = header[5:].split(";")[0]
        name = f"inline-{abs(hash(b64)) % 10**10}{EXT.get(mime, '.png')}"
        (PUBLIC_UPLOADS / name).write_bytes(base64.b64decode(b64))
        copied += 1
        return f"/uploads/{name}"
    return value


def main():
    if not DB.exists():
        print("No backend/data/db.json found. Start the backend and make your changes in the admin first.")
        return
    PUBLIC_UPLOADS.mkdir(parents=True, exist_ok=True)
    db = json.loads(DB.read_text(encoding="utf-8"))
    settings = fix(db["settings"])
    products = fix(db["products"])
    for folder in (ROOT / "frontend" / "data", ROOT / "backend" / "data"):
        (folder / "settings.json").write_text(json.dumps(settings, indent=2, ensure_ascii=False), encoding="utf-8")
        (folder / "products.json").write_text(json.dumps(products, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"✓ Exported {len(settings['hero']['slides'])} hero slides and {len(products)} products")
    print(f"✓ Copied {copied} image references into frontend/public/uploads/")
    print('Next: git add . && git commit -m "Update homepage" && git push')


if __name__ == "__main__":
    main()
