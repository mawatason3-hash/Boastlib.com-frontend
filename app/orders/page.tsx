import { Sidebar } from "../components/Sidebar";
import { Eye, Download } from "lucide-react";

const orders = [
  { id: "10001", service: "Instagram Followers", link: "https://www.banple.com/instagram", qty: "1,000", start: "100", remains: "0", charge: "$24.50", status: "Completed", date: "12/05/2023" },
  { id: "10002", service: "TikTok", link: "https://www.banple.com/tiktok", qty: "1,000", start: "100", remains: "100", charge: "$1.50", status: "Processing", date: "12/05/2023" },
  { id: "10003", service: "Instagram", link: "https://www.banple.com/instagram", qty: "1,000", start: "100", remains: "100", charge: "$1.50", status: "Pending", date: "12/05/2023" },
];

export default function OrdersPage() {
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
              <button className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white">Export CSV <Download size={18} /></button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <input className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none lg:max-w-md" placeholder="Order ID / Link" />
              <div className="flex flex-wrap gap-3">
                {['All','Pending','Processing','Completed','Cancelled'].map((status) => (
                  <button key={status} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900">{status}</button>
                ))}
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
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
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/10 last:border-b-0 hover:bg-slate-950/60">
                      <td className="px-6 py-4 text-brand-blue">{order.id}</td>
                      <td className="px-6 py-4">{order.service}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{order.link}</td>
                      <td className="px-6 py-4">{order.qty}</td>
                      <td className="px-6 py-4">{order.start}</td>
                      <td className="px-6 py-4">{order.remains}</td>
                      <td className="px-6 py-4">{order.charge}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">{order.status}</span>
                      </td>
                      <td className="px-6 py-4">{order.date}</td>
                      <td className="px-6 py-4"><Eye size={18} className="text-slate-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
