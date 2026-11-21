import { FREE_SHIPPING_THRESHOLD, formatPKR } from "@/lib/catalog";
import { SparkleIcon } from "./Icons";

const messages = [
  `Free delivery on orders over ${formatPKR(FREE_SHIPPING_THRESHOLD)}`,
  "Cash on delivery across Pakistan",
  "Every piece is painted by hand",
  "Complimentary gift wrapping",
  "Custom orders now open",
];

export default function AnnouncementBar() {
  const row = [...messages, ...messages];
  return (
    <div className="overflow-hidden bg-plum py-2 text-[11px] uppercase tracking-[0.22em] text-blush">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((m, i) => (
          <span key={i} className="flex items-center gap-10">
            {m} <SparkleIcon className="h-3 w-3 text-gold-light" />
          </span>
        ))}
      </div>
    </div>
  );
}
