import { Sidebar } from "../../components/Sidebar";

export default function AdminAnalyticsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Analytics</p>
            <h1 className="mt-2 text-3xl font-semibold">Platform performance</h1>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Traffic</p>
              <div className="mt-6 h-72 rounded-3xl bg-slate-900/80 p-6 text-slate-400">Chart placeholder</div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Revenue</p>
              <div className="mt-6 h-72 rounded-3xl bg-slate-900/80 p-6 text-slate-400">Chart placeholder</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
