"use client";
import { Fragment, useEffect, useState } from "react";
import { formatPKR } from "@/lib/catalog";
import { listOrders, updateOrderStatus } from "@/lib/store";
import type { Order } from "@/lib/types";

const STATUSES: Order["status"][] = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const COLORS: Record<Order["status"], string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => { listOrders().then(setOrders); }, []);
  const shown = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <p className="eyebrow">Sales</p>
      <h1 className="mt-2 font-serif text-4xl text-plum">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {["", ...STATUSES].map((s) => (
          <button key={s || "all"} onClick={() => setFilter(s)} className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest ${filter === s ? "bg-rose text-white" : "bg-white text-plum"}`}>
            {s || "All"} {s ? `(${orders.filter((o) => o.status === s).length})` : `(${orders.length})`}
          </button>
        ))}
      </div>

      <div className="card mt-6 overflow-x-auto">
        {shown.length === 0 ? (
          <p className="p-10 text-center text-sm text-plum/60">No orders yet. Place a test order from the store to see it here.</p>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-blush text-xs uppercase tracking-widest text-plum/50">
              <tr><th className="p-4">Order</th><th>Date</th><th>Customer</th><th>City</th><th>Payment</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody className="divide-y divide-blush">
              {shown.map((o) => (
                <Fragment key={o.id}>
                  <tr className="cursor-pointer hover:bg-blush-soft/60" onClick={() => setOpen(open === o.id ? null : o.id)}>
                    <td className="p-4 font-medium text-plum">{o.id}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString("en-PK")}</td>
                    <td>{o.customer.name}<br /><span className="text-xs text-plum/50">{o.customer.phone}</span></td>
                    <td>{o.customer.city}</td>
                    <td className="uppercase text-xs">{o.paymentMethod}</td>
                    <td>{formatPKR(o.total)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={async (e) => setOrders(await updateOrderStatus(o.id, e.target.value as Order["status"]))}
                        className={`rounded-full px-3 py-1 text-xs outline-none ${COLORS[o.status]}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {open === o.id && (
                    <tr className="bg-blush-soft/50">
                      <td colSpan={7} className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <p className="label">Items</p>
                            <ul className="space-y-1">
                              {o.items.map((i) => <li key={i.slug}>{i.qty} × {i.name} · {formatPKR(i.price * i.qty)} {i.giftWrap && "🎁"}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="label">Deliver to</p>
                            <p>{o.customer.address}, {o.customer.city}</p>
                            {o.customer.notes && <p className="mt-2 italic text-plum/70">Note: “{o.customer.notes}”</p>}
                            <a href={`https://wa.me/${o.customer.phone.replace(/^0/, "92").replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-rose hover:underline">
                              Confirm on WhatsApp →
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
