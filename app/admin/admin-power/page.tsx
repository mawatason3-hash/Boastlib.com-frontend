import { Sidebar } from "../../components/Sidebar";

export default function AdminPowerPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Admin power</p>
            <h1 className="mt-2 text-3xl font-semibold">Boost your personal account</h1>
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="grid gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Boost your account</p>
                  <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <select className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                      <option>Instagram</option>
                      <option>TikTok</option>
                    </select>
                    <input className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="Your account link/username" />
                    <input type="number" className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="Quantity" />
                    <div className="rounded-3xl bg-slate-950/70 p-4 text-sm text-slate-300">
                      <p>Provider cost: $0.85</p>
                      <p>Your cost: $0.00 (ADMIN privilege)</p>
                    </div>
                    <button className="w-full rounded-3xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white">Boost Now — FREE</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-300">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Policy</p>
                <p className="mt-4">ADMIN Power is for personal accounts only. Use responsibly.</p>
              </div>
              <div className="mt-6 grid gap-4">
                {[
                  { label: "Total Boosts Used", value: "235" },
                  { label: "Credits Saved", value: "12,963" },
                  { label: "This Month", value: "99/7" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
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
