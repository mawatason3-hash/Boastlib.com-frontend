import { Sidebar } from "../../components/Sidebar";

const stats = [
  { title: "Total Users", value: "1,247" },
  { title: "Orders Today", value: "89" },
  { title: "Revenue Today", value: "$234.50" },
  { title: "Monthly Revenue", value: "$4,820" },
  { title: "Pending Orders", value: "12" },
  { title: "Active Issues", value: "2" },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-semibold">Admin dashboard</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Monthly revenue</p>
              <div className="mt-6 h-72 rounded-3xl bg-slate-900/80 p-6 text-slate-400">Chart placeholder</div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Recent orders</p>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                {['10012','10013','10014'].map((id) => (
                  <div key={id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <p className="font-semibold text-white">Order #{id}</p>
                    <p className="text-slate-400">Completed • $24.50</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
