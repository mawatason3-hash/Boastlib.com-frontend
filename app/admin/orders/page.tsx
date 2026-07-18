import { Sidebar } from "../../components/Sidebar";

const orders = [
  { id: "10001", user: "Alekos", service: "Instagram Followers", status: "Funding", amount: "$24.50", date: "12/05/2023" },
  { id: "10002", user: "Jonnmod", service: "TikTok Likes", status: "Processing", amount: "$1.50", date: "12/05/2023" },
  { id: "10003", user: "Drivanasma", service: "YouTube Views", status: "Cancelled", amount: "$2.50", date: "12/05/2023" },
];

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Admin orders</p>
            <h1 className="mt-2 text-3xl font-semibold">All orders</h1>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 bg-slate-950/80 text-slate-400">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/10 last:border-b-0 hover:bg-slate-950/60">
                      <td className="px-6 py-4 text-brand-blue">{order.id}</td>
                      <td className="px-6 py-4">{order.user}</td>
                      <td className="px-6 py-4">{order.service}</td>
                      <td className="px-6 py-4">{order.status}</td>
                      <td className="px-6 py-4">{order.amount}</td>
                      <td className="px-6 py-4">{order.date}</td>
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
