import { Sidebar } from "../../components/Sidebar";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold">Admin configuration</h1>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="grid gap-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Developer info</p>
                <div className="mt-6 space-y-4">
                  <label className="block text-sm text-slate-300">Name</label>
                  <input className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="Built by Solomon" />
                  <label className="block text-sm text-slate-300">Contact</label>
                  <input className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="support@boastlib.com" />
                  <label className="block text-sm text-slate-300">Credit line</label>
                  <input className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="Built by Solomon" />
                </div>
                <button className="mt-6 rounded-3xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white">Save developer info</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
