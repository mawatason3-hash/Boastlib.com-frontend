import { Sidebar } from "../../components/Sidebar";

const keys = [
  { id: "K1001", issuedTo: "DevCorp", status: "Pending", created: "12/05/2023" },
  { id: "K1002", issuedTo: "AgencyX", status: "Active", created: "12/05/2023" },
];

export default function AdminDeveloperKeysPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Developer keys</p>
            <h1 className="mt-2 text-3xl font-semibold">Approve or revoke requests</h1>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 bg-slate-950/80 text-slate-400">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Issued To</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key) => (
                    <tr key={key.id} className="border-b border-white/10 last:border-b-0 hover:bg-slate-950/60">
                      <td className="px-6 py-4 text-brand-blue">{key.id}</td>
                      <td className="px-6 py-4">{key.issuedTo}</td>
                      <td className="px-6 py-4">{key.status}</td>
                      <td className="px-6 py-4">{key.created}</td>
                      <td className="px-6 py-4">{key.status === 'Pending' ? 'Approve / Revoke' : 'Revoke'}</td>
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
