"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "../components/Sidebar";
import api from "@/lib/api";

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

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<ServiceItem[]>("/public/services?limit=30");
        setServices(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const platforms = Array.from(new Set(services.map((service) => service.platform))).sort();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Services</p>
            <h1 className="mt-2 text-3xl font-semibold">Explore available services</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">Browse the live service catalog and place new campaigns straight from your dashboard.</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Live catalog</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Top active services</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform) => (
                  <Link
                    key={platform}
                    href={`/services/${encodeURIComponent(platform)}`}
                    className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:border-brand-blue hover:text-white"
                  >
                    {platform}
                  </Link>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">Loading services…</div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-200">{error}</div>
            ) : services.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">No services are available at the moment.</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <div key={service.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">{service.platform} • {service.category}</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">{service.name}</h3>
                      </div>
                      <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">${service.rate_per_1000.toFixed(2)} / 1K</div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                      <span className="rounded-full bg-slate-800 px-3 py-1">Min: {service.min_qty}</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1">Max: {service.max_qty}</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1">{service.speed_estimate || "Standard"}</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1">{service.guaranteed ? "Guaranteed" : "No guarantee"}</span>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/new-order?serviceId=${service.id}`}
                        className="inline-flex rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Order now
                      </Link>
                      <Link
                        href={`/services/${encodeURIComponent(service.platform)}`}
                        className="inline-flex rounded-full border border-white/10 bg-slate-950/80 px-5 py-3 text-sm text-slate-300 transition hover:border-brand-blue hover:text-white"
                      >
                        View platform
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
