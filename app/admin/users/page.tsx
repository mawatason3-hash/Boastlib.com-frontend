import { Sidebar } from "../../components/Sidebar";

const users = [
  { name: "Alekos Sitardis", email: "aleksis@boastlib.com", balance: "$330.00", status: "Active" },
  { name: "Jonnmod", email: "jonnmod@boastlib.com", balance: "$150.00", status: "Suspended" },
  { name: "Drivanasma", email: "drivanasma@boastlib.com", balance: "$230.00", status: "Banned" },
];

export default function AdminUsersPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Users</p>
            <h1 className="mt-2 text-3xl font-semibold">User management</h1>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 bg-slate-950/80 text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email} className="border-b border-white/10 last:border-b-0 hover:bg-slate-950/60">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.balance}</td>
                      <td className="px-6 py-4"><span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{user.status}</span></td>
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
