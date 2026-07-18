'use client';

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "../components/Sidebar";
import { Search, ArrowRight, DollarSign, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

const platforms = ["Instagram", "TikTok", "YouTube", "Facebook", "Twitter X", "Telegram", "Spotify", "Discord"];

type ServiceItem = {
  id: string;
  platform: string;
  category: string;
  name: string;
  rate_per_1000: number;
  min_qty: number;
  max_qty: number;
  speed_estimate?: string;
  start_time_estimate?: string;
  guaranteed?: boolean;
  drip_feed_enabled?: boolean;
};

type CalculateResponse = {
  charge: number;
  quantity: number;
  service: {
    id: string;
    platform: string;
    category: string;
    name: string;
    rate_per_1000: number;
    min_qty: number;
    max_qty: number;
  };
  metadata: {
    speed_estimate?: string;
    start_time_estimate?: string;
    avg_time_minutes?: number | null;
    guaranteed: boolean;
    drip_feed_enabled: boolean;
  };
};

function NewOrderPageContent() {
  const router = useRouter();
  const [platform, setPlatform] = useState(platforms[0]);
  const [query, setQuery] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quantity, setQuantity] = useState(1000);
  const [link, setLink] = useState("");
  const [calculateData, setCalculateData] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  useEffect(() => {
    if (!serviceId) {
      return;
    }

    const loadService = async () => {
      setServiceLoading(true);
      setError(null);
      setSelectedService(null);
      try {
        const response = await api.get<ServiceItem>(`/services/${serviceId}`);
        const service = response.data;
        setSelectedService(service);
        setPlatform(service.platform);
        setQuantity(service.min_qty || 1000);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to load service details.");
      } finally {
        setServiceLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (platform) params.set("network", platform);
        if (query.trim()) params.set("q", query.trim());
        const response = await api.get(`/services/search?${params.toString()}`);
        setServices(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [platform, query]);

  useEffect(() => {
    const calculate = async () => {
      if (!selectedService || quantity <= 0) {
        setCalculateData(null);
        return;
      }

      setError(null);
      try {
        const response = await api.post<CalculateResponse>(`/services/${selectedService.id}/calculate`, {
          quantity,
        });
        setCalculateData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to calculate price.");
        setCalculateData(null);
      }
    };

    calculate();
  }, [selectedService, quantity]);

  const summary = useMemo(() => {
    if (!selectedService || !calculateData) {
      return null;
    }
    return {
      charge: calculateData.charge,
      rate: selectedService.rate_per_1000,
      speed: selectedService.speed_estimate || "Standard delivery",
      startTime: selectedService.start_time_estimate || "Estimated start time available after order",
      guaranteed: selectedService.guaranteed ? "Guaranteed" : "No guarantee",
      dripFeed: selectedService.drip_feed_enabled ? "Drip-feed available" : "One-time campaign",
    };
  }, [selectedService, calculateData]);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setQuantity(service.min_qty || 1000);
    setLink("");
    setMessage(null);
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedService) {
      setError("Please select a service first.");
      return;
    }
    if (!link.trim()) {
      setError("Please enter a valid campaign link.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.post("/orders", {
        serviceId: selectedService.id,
        link: link.trim(),
        quantity,
      });
      setMessage("Order placed successfully.");
      router.push("/orders");
    } catch (err: any) {
      setError(err.response?.data?.error || "Unable to place order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">New Order</p>
                <h1 className="mt-2 text-3xl font-semibold">Create a new order</h1>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={saving || !selectedService}
                className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Place Order <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_0.65fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              {serviceId ? (
                <div className="space-y-6">
                  {serviceLoading ? (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">Loading service details...</div>
                  ) : error ? (
                    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-200">{error}</div>
                  ) : selectedService ? (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Selected service</p>
                      <h2 className="mt-4 text-2xl font-semibold text-white">{selectedService.name}</h2>
                      <p className="mt-2 text-sm text-slate-400">{selectedService.platform} • {selectedService.category}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">Rate: ${selectedService.rate_per_1000.toFixed(2)}/1K</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">Min: {selectedService.min_qty}</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">Max: {selectedService.max_qty}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">Select a service to continue.</div>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {platforms.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPlatform(item)}
                        className={`rounded-3xl border px-4 py-4 text-left transition ${item === platform ? "border-brand-blue bg-slate-800" : "border-white/10 bg-slate-900/80 hover:border-slate-400"}`}
                      >
                        <p className="font-semibold text-white">{item}</p>
                        <p className="mt-2 text-sm text-slate-400">Browse {item} services</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Search service</p>
                        <div className="mt-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950 px-4 py-3">
                          <Search size={18} />
                          <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="w-full bg-transparent text-white outline-none"
                            placeholder="Search services"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Selected network</p>
                        <div className="mt-3 rounded-3xl border border-white/10 bg-slate-950 px-4 py-4 text-white">{platform}</div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      {loading ? (
                        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">Loading services...</div>
                      ) : services.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">No services found for this query.</div>
                      ) : (
                        services.map((service) => {
                          const isSelected = selectedService?.id === service.id;
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => handleSelectService(service)}
                              className={`w-full rounded-3xl border p-5 text-left transition ${isSelected ? "border-brand-blue bg-slate-800" : "border-white/10 bg-slate-900/80 hover:border-slate-400"}`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-lg font-semibold text-white">{service.name}</p>
                                  <p className="mt-2 text-sm text-slate-400">{service.category} · {service.platform}</p>
                                </div>
                                <div className="rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white">${service.rate_per_1000.toFixed(2)} / 1K</div>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">{service.speed_estimate || "Standard"}</span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">{service.guaranteed ? "Guaranteed" : "No guarantee"}</span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">{service.drip_feed_enabled ? "Drip-feed" : "One-time"}</span>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Order details</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{selectedService ? selectedService.name : "Select a service"}</h2>
                  </div>
                  <DollarSign size={24} className="text-brand-gold" />
                </div>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm text-slate-400">Service</span>
                    <input
                      value={selectedService ? `${selectedService.platform} · ${selectedService.category}` : "Choose a service above"}
                      readOnly
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-slate-400">Campaign link</span>
                    <input
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                      placeholder="https://"
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                    />
                  </label>

                  <label className="block">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-400">Quantity</span>
                      <span className="text-sm text-slate-400">Min {selectedService?.min_qty ?? 0} • Max {selectedService?.max_qty ?? 0}</span>
                    </div>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(event) => setQuantity(Number(event.target.value))}
                      min={selectedService?.min_qty ?? 1}
                      max={selectedService?.max_qty ?? 100000}
                      disabled={!selectedService}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                    />
                  </label>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Estimated charge</p>
                        <p className="mt-2 text-3xl font-semibold text-white">{calculateData ? `$${calculateData.charge.toFixed(2)}` : "—"}</p>
                      </div>
                      <div className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-300">
                        {selectedService ? `$${selectedService.rate_per_1000.toFixed(2)} / 1K` : "Rate"}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">The system recalculates pricing from the active provider markup and locks it at checkout.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                    <div className="flex items-center gap-2 text-brand-gold">
                      <Clock size={16} />
                      <span className="text-sm font-semibold">Delivery speed</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{summary?.speed || "Standard delivery"}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                    <div className="flex items-center gap-2 text-brand-gold">
                      <ShieldCheck size={16} />
                      <span className="text-sm font-semibold">Guarantee</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{summary?.guaranteed || "Not guaranteed"}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 sm:col-span-2">
                    <div className="flex items-center gap-2 text-brand-gold">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-semibold">Delivery type</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{summary?.dripFeed || "One time campaign"}</p>
                  </div>
                </div>

                {error ? <p className="mt-4 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}
                {message ? <p className="mt-4 rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</p> : null}

                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedService || saving}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Placing order..." : "Confirm order"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 px-6 py-8 text-white">Loading...</div>}>
      <NewOrderPageContent />
    </Suspense>
  );
}
