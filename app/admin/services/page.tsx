import { Sidebar } from "../../components/Sidebar";

const services = [
  { name: "Instagram Followers - High Retention", platform: "Instagram", category: "Followers", rate: "$0.80 / 1K", provider: "JAP", active: true },
  { name: "TikTok Likes", platform: "TikTok", category: "Likes", rate: "$0.95 / 1K", provider: "Peakerr", active: true },
  { name: "YouTube Views", platform: "YouTube", category: "Views", rate: "$0.70 / 1K", provider: "SMMWiz", active: false },
];

export default function AdminServicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Admin services</p>
            <h1 className="mt-2 text-3xl font-semibold">Services management</h1>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <input className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none sm:max-w-md" placeholder="Search services" />
              <button className="rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white">Add New Service</button>
            </div>
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 bg-slate-950/80 text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Platform</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Rate</th>
                    <th className="px-6 py-4">Active Provider</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.name} className="border-b border-white/10 last:border-b-0 hover:bg-slate-950/60">
                      <td className="px-6 py-4">{service.name}</td>
                      <td className="px-6 py-4">{service.platform}</td>
                      <td className="px-6 py-4">{service.category}</td>
                      <td className="px-6 py-4">{service.rate}</td>
                      <td className="px-6 py-4">{service.provider}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs ${service.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{service.active ? 'Active' : 'Inactive'}</span></td>
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
