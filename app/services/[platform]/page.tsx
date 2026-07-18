import type { Metadata } from "next";
import { buildMetadata, buildCommonDescription } from "@/lib/seo";

type ServiceItem = {
  id: string;
  platform: string;
  category: string;
  name: string;
  rate_per_1000: number;
  min_qty: number;
  max_qty: number;
  speed_estimate?: string;
  guaranteed?: boolean;
  drip_feed_enabled?: boolean;
};

async function fetchPlatformServices(platform: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const response = await fetch(`${apiUrl}/api/public/services?platform=${encodeURIComponent(platform)}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to fetch platform services");
  }
  return (await response.json()) as ServiceItem[];
}

export async function generateMetadata({ params }: { params: { platform: string } }): Promise<Metadata> {
  const title = `${params.platform} Services`;
  const description = buildCommonDescription(`Live ${params.platform} service pricing and order options on BoastLib.`);
  return buildMetadata({ title, description, path: `/services/${params.platform}` });
}

export default async function PlatformServicesPage({ params }: { params: { platform: string } }) {
  const platform = params.platform;
  const services = await fetchPlatformServices(platform);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">{platform}</p>
          <h1 className="mt-4 text-3xl font-semibold">{platform} services</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Browse live {platform} pricing pulled directly from the service catalog.</p>
        </div>

        <div className="grid gap-6">
          {services.map((service) => (
            <div key={service.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">{service.category}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{service.name}</h2>
                </div>
                <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">${service.rate_per_1000.toFixed(2)} / 1K</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full bg-slate-800 px-3 py-1">Min: {service.min_qty}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">Max: {service.max_qty}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">{service.speed_estimate || "Standard delivery"}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">{service.guaranteed ? "Guaranteed" : "No guarantee"}</span>
              </div>
              <div className="mt-6">
                <a
                  href={`/new-order?serviceId=${service.id}`}
                  className="inline-flex rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Order now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
