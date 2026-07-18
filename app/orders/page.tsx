"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Eye, Download } from "lucide-react";
import api from "@/lib/api";

type Order = {
  id: string;
  service?: string;
  service_name?: string;
  link?: string;
  quantity?: number | string;
  qty?: number | string;
  start?: number | string;
  remains?: number | string;
  charge?: number | string;
  status?: string;
  created_at?: string;
};

const statusOptions = ["All", "Pending", "Processing", "Completed", "Cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
    return orders.filter((order) => order.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">My Orders</p>
                <h1 className="mt-2 text-3xl font-semibold">Order history</h1>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white">
                Export CSV <Download size={18} />
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <input
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none lg:max-w-md"
                placeholder="Order ID / Link"
              />
              <div className="flex flex-wrap gap-3">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      statusFilter === status ? "border-brand-blue bg-brand-blue/10 text-white" : "border-white/10 text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Loading orders…</div>
              ) : error ? (
                <div className="p-8 text-center text-rose-300">{error}</div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No orders match this filter.</div>
              ) : (
                <table className="min-w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-white/10 bg-slate-950/80 text-slate-400">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Link</th>
                      <th className="px-6 py-4">Qty</th>
                      <th className="px-6 py-4">Start</th>
                      <th className="px-6 py-4">Remains</th>
                      <th className="px-6 py-4">Charge</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-white/10 last:border-b-0 hover:bg-slate-950/60">
                        <td className="px-6 py-4 text-brand-blue">{order.id}</td>
                        <td className="px-6 py-4">{order.service || order.service_name || "Service"}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{order.link ?? "—"}</td>
                        <td className="px-6 py-4">{order.quantity ?? order.qty ?? "—"}</td>
                        <td className="px-6 py-4">{order.start ?? "—"}</td>
                        <td className="px-6 py-4">{order.remains ?? "—"}</td>
                        <td className="px-6 py-4">{typeof order.charge === "number" ? `$${order.charge.toFixed(2)}` : order.charge ?? "—"}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">{order.status ?? "Unknown"}</span>
                        </td>
                        <td className="px-6 py-4">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}</td>
                        <td className="px-6 py-4"><Eye size={18} className="text-slate-300" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
