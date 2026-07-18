import { Sidebar } from "../components/Sidebar";

const services = [
  { platform: "Instagram", category: "Followers", name: "Instagram Followers - High Retention", rate: "$0.80 / 1K", min: "100", max: "100K", speed: "Instant", quality: "High" },
  { platform: "TikTok", category: "Likes", name: "TikTok Likes", rate: "$0.95 / 1K", min: "50", max: "50K", speed: "Instant", quality: "Best Seller" },
  { platform: "YouTube", category: "Views", name: "YouTube Views", rate: "$0.70 / 1K", min: "100", max: "100K", speed: "1-2 hrs", quality: "Standard" },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Services</p>
            <h1 className="mt-2 text-3xl font-semibold">Explore available services</h1>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="grid gap-6">
              {services.map((service) => (
                <div key={service.name} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">{service.platform} • {service.category}</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{service.name}</h2>
                    </div>
                    <div className="space-y-2 text-sm text-slate-400">
                      <p>Rate: {service.rate}</p>
                      <p>Min: {service.min} • Max: {service.max}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{service.speed}</span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">Quality: {service.quality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
