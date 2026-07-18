import { Sidebar } from "../../components/Sidebar";

const logs = [
  { id: "1", event: "Admin login", date: "12/05/2023 16:32" },
  { id: "2", event: "Service price sync", date: "12/05/2023 15:20" },
  { id: "3", event: "User balance updated", date: "12/05/2023 14:10" },
];

export default function AdminActivityLogPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Activity log</p>
            <h1 className="mt-2 text-3xl font-semibold">Recent admin activity</h1>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">{log.event}</p>
                  <p className="mt-2 text-sm text-slate-400">{log.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
