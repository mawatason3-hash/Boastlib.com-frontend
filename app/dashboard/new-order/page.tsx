"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, DollarSign, LayoutGrid, Search, ShieldCheck, Star, Sparkles } from "lucide-react";
import { Sidebar } from "../../components/Sidebar";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const platforms = [
  { name: "Instagram", color: "from-pink-500 to-orange-400" },
  { name: "TikTok", color: "from-slate-300 to-slate-500" },
  { name: "YouTube", color: "from-red-500 to-orange-500" },
  { name: "Facebook", color: "from-blue-500 to-cyan-500" },
  { name: "X", color: "from-slate-500 to-slate-700" },
  { name: "Telegram", color: "from-sky-400 to-blue-600" },
  { name: "Spotify", color: "from-green-500 to-emerald-500" },
  { name: "Discord", color: "from-violet-500 to-fuchsia-500" },
];

const stepLabels = [
  "Pick platform",
  "Browse catalog",
  "Service details",
  "Order setup",
  "Price preview",
  "Confirm order",
  "Order tracking",
];

const finalStatuses = ["completed", "canceled", "cancelled", "failed"];

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

type CalculateResponse = {
  charge: number;
  quantity: number;
  service: ServiceItem;
  metadata: {
    speed_estimate?: string;
    start_time_estimate?: string;
    avg_time_minutes?: number | null;
    guaranteed: boolean;
    drip_feed_enabled: boolean;
  };
};

type OrderDetail = {
  id: string;
  service_name: string;
  service_platform: string;
  status: string;
  charge: number;
  quantity: number;
  link: string;
  created_at: string;
  updated_at?: string;
};

export default function DashboardNewOrderPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0].name);
  const [query, setQuery] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quantity, setQuantity] = useState(1000);
  const [link, setLink] = useState("");
  const [calculateData, setCalculateData] = useState<CalculateResponse | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stepError, setStepError] = useState("");
  const [orderError, setOrderError] = useState("");

  const currentStepLabel = stepLabels[currentStep - 1] || "Order flow";

  useEffect(() => {
    if (!serviceId) return;
    setLoadingServices(true);
    setStepError("");
    api
      .get<ServiceItem>(`/services/${serviceId}`)
      .then((response) => {
        setSelectedService(response.data);
        setSelectedPlatform(response.data.platform);
        setQuantity(response.data.min_qty || 1000);
        setCurrentStep(3);
      })
      .catch((error) => {
        setStepError(error.response?.data?.error || "Unable to load selected service.");
      })
      .finally(() => setLoadingServices(false));
  }, [serviceId]);

  useEffect(() => {
    if (currentStep !== 2) return;
    setLoadingServices(true);
    setStepError("");
    const params = new URLSearchParams();
    if (selectedPlatform) params.set("platform", selectedPlatform);
    if (query.trim()) params.set("q", query.trim());

    api
      .get<ServiceItem[]>(`/services/search?${params.toString()}`)
      .then((response) => setServices(response.data || []))
      .catch((error) => setStepError(error.response?.data?.error || "Unable to load services."))
      .finally(() => setLoadingServices(false));
  }, [currentStep, selectedPlatform, query]);

  useEffect(() => {
    if (!selectedService) {
      setCalculateData(null);
      return;
    }
    if (quantity <= 0) {
      setCalculateData(null);
      return;
    }

    api
      .post<CalculateResponse>(`/services/${selectedService.id}/calculate`, { quantity })
      .then((response) => setCalculateData(response.data))
      .catch((error) => {
        setOrderError(error.response?.data?.error || "Unable to calculate service price.");
      });
  }, [selectedService, quantity]);

  useEffect(() => {
    if (!orderId) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const fetchOrder = async () => {
      try {
        const response = await api.get<OrderDetail>(`/orders/${orderId}`);
        setOrderDetail(response.data);
        if (response.data.status && finalStatuses.includes(response.data.status.toLowerCase())) {
          setCurrentStep(7);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (error: any) {
        setOrderError(error.response?.data?.error || "Unable to refresh order status.");
      }
    };

    fetchOrder();
    intervalId = setInterval(fetchOrder, 60000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId]);

  const handleSelectPlatform = (name: string) => {
    setSelectedPlatform(name);
    setQuery("");
    setSelectedService(null);
    setStepError("");
    setCurrentStep(2);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setQuantity(service.min_qty || 1000);
    setLink("");
    setStepError("");
    setCurrentStep(3);
  };

  const handleContinue = () => {
    if (currentStep === 2 && !selectedService) {
      setStepError("Please select a service before continuing.");
      return;
    }
    if (currentStep === 3 && (!link.trim() || quantity <= 0)) {
      setStepError("Enter a valid campaign link and quantity before continuing.");
      return;
    }
    if (currentStep === 4 && !calculateData) {
      setStepError("Waiting for pricing information before continuing.");
      return;
    }

    setStepError("");
    setCurrentStep((current) => Math.min(current + 1, 7));
  };

  const handleBack = () => {
    if (currentStep === 7) {
      setCurrentStep(6);
      return;
    }
    setStepError("");
    setCurrentStep((current) => Math.max(current - 1, 1));
  };

  const handlePlaceOrder = async () => {
    if (!selectedService) {
      setStepError("Select a service first.");
      return;
    }
    if (!link.trim()) {
      setStepError("Please provide a campaign link.");
      return;
    }
    setSaving(true);
    setOrderError("");
    try {
      const response = await api.post<OrderDetail>("/orders", {
        serviceId: selectedService.id,
        link: link.trim(),
        quantity,
      });
      setOrderId(response.data.id);
      setCurrentStep(6);
      showToast("Order submitted. Live tracking will update every 60 seconds.", "success");
    } catch (error: any) {
      setOrderError(error.response?.data?.error || "Unable to place order.");
    } finally {
      setSaving(false);
    }
  };

  const selectedServiceSummary = selectedService ? (
    <div className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Selected service</p>
      <h2 className="text-2xl font-semibold text-white">{selectedService.name}</h2>
      <p className="text-sm text-slate-400">{selectedService.platform} • {selectedService.category}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
        <span className="rounded-full bg-slate-950 px-3 py-1">Min {selectedService.min_qty}</span>
        <span className="rounded-full bg-slate-950 px-3 py-1">Max {selectedService.max_qty}</span>
        <span className="rounded-full bg-slate-950 px-3 py-1">Rate ${selectedService.rate_per_1000.toFixed(2)} / 1K</span>
      </div>
    </div>
  ) : null;

  const progress = useMemo(
    () => stepLabels.map((label, index) => ({
      label,
      active: index + 1 === currentStep,
      complete: index + 1 < currentStep,
    })),
    [currentStep]
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">New order</p>
                <h1 className="mt-2 text-3xl font-semibold">Create a campaign with live JAP-style flow</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Follow the step-by-step workflow from platform selection to live order tracking.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-5 text-sm text-slate-300">
                <p className="font-semibold text-white">Current stage</p>
                <p className="mt-2">{currentStepLabel}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-7">
              {progress.map((step, index) => (
                <div
                  key={step.label}
                  className={`rounded-3xl border px-3 py-3 text-center text-[0.7rem] uppercase tracking-[0.3em] transition ${
                    step.complete
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-100"
                      : step.active
                      ? "border-brand-blue bg-brand-blue/10 text-white"
                      : "border-white/10 bg-slate-900 text-slate-400"
                  }`}
                >
                  <span className="block font-semibold">{index + 1}</span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              {currentStep === 1 ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {platforms.map((platform) => (
                      <button
                        key={platform.name}
                        type="button"
                        onClick={() => handleSelectPlatform(platform.name)}
                        className={`rounded-3xl border px-5 py-6 text-left transition ${
                          selectedPlatform === platform.name
                            ? "border-brand-blue bg-slate-900 text-white"
                            : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-brand-blue/50"
                        }`}
                      >
                        <div className={`inline-flex rounded-3xl bg-gradient-to-br ${platform.color} px-3 py-2 text-sm font-semibold text-white`}>{platform.name}</div>
                        <p className="mt-4 text-sm text-slate-400">Select {platform.name} services and pricing.</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-400">Choose the platform you want to source service options from.</p>
                    <button onClick={handleContinue} className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7689ff]">
                      Continue <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : currentStep === 2 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-[1fr_300px]">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Catalog search</p>
                      <div className="mt-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950 px-4 py-3">
                        <Search size={18} />
                        <input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search service name or category"
                          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Selected platform</p>
                      <div className="mt-3 rounded-3xl border border-white/10 bg-slate-950 px-4 py-4 text-white">{selectedPlatform}</div>
                    </div>
                  </div>

                  {loadingServices ? (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">Loading services…</div>
                  ) : services.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">No services match that platform or search term.</div>
                  ) : (
                    <div className="grid gap-4">
                      {services.map((service) => {
                        const isSelected = selectedService?.id === service.id;
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => handleSelectService(service)}
                            className={`w-full rounded-3xl border p-6 text-left transition ${
                              isSelected ? "border-brand-blue bg-slate-900" : "border-white/10 bg-slate-950/70 hover:border-brand-blue/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-lg font-semibold text-white">{service.name}</p>
                                <p className="mt-2 text-sm text-slate-400">{service.category}</p>
                              </div>
                              <div className="rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white">${service.rate_per_1000.toFixed(2)} / 1K</div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-300">
                              <span className="rounded-full bg-slate-900 px-3 py-1">Min {service.min_qty}</span>
                              <span className="rounded-full bg-slate-900 px-3 py-1">Max {service.max_qty}</span>
                              <span className="rounded-full bg-slate-900 px-3 py-1">{service.guaranteed ? "Guaranteed" : "No guarantee"}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <button onClick={handleBack} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-blue">
                      Back
                    </button>
                    <button onClick={handleContinue} className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7689ff]">
                      Continue <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : currentStep === 3 ? (
                <div className="space-y-6">
                  {selectedServiceSummary}
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Order information</p>
                    <label className="mt-6 block">
                      <span className="text-sm text-slate-400">Campaign link</span>
                      <input
                        type="url"
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        placeholder="https://"
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="mt-6 block">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-slate-400">Quantity</span>
                        <span className="text-sm text-slate-400">Min {selectedService?.min_qty ?? 0} • Max {selectedService?.max_qty ?? 0}</span>
                      </div>
                      <input
                        type="number"
                        value={quantity}
                        min={selectedService?.min_qty ?? 1}
                        max={selectedService?.max_qty ?? 100000}
                        onChange={(event) => setQuantity(Number(event.target.value))}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <button onClick={handleBack} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-blue">
                      Back
                    </button>
                    <button onClick={handleContinue} className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7689ff]">
                      Price preview <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : currentStep === 4 ? (
                <div className="space-y-6">
                  {selectedServiceSummary}
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Pricing preview</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Live calculation</h2>
                      </div>
                      <DollarSign className="text-brand-gold" size={24} />
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm text-slate-400">Estimated charge</p>
                          <p className="text-lg font-semibold text-white">{calculateData ? `$${calculateData.charge.toFixed(2)}` : "Pending"}</p>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                          <p className="text-sm text-slate-400">Quantity</p>
                          <p className="mt-2 text-white">{quantity}</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                          <p className="text-sm text-slate-400">Rate</p>
                          <p className="mt-2 text-white">${selectedService?.rate_per_1000.toFixed(2)} / 1K</p>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                          <p className="text-sm text-slate-400">Speed</p>
                          <p className="mt-2 text-white">{selectedService?.speed_estimate || "Standard delivery"}</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                          <p className="text-sm text-slate-400">Guarantee</p>
                          <p className="mt-2 text-white">{selectedService?.guaranteed ? "Guaranteed" : "Not guaranteed"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <button onClick={handleBack} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-blue">
                      Back
                    </button>
                    <button onClick={handleContinue} className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7689ff]">
                      Confirm details <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : currentStep === 5 ? (
                <div className="space-y-6">
                  {selectedServiceSummary}
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Review order</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Ready to place the campaign</h2>
                      </div>
                      <Star className="text-brand-blue" size={24} />
                    </div>

                    <div className="mt-6 space-y-4 text-slate-300">
                      <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <p>Campaign link</p>
                          <p className="text-white truncate">{link || "—"}</p>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                          <p>Quantity</p>
                          <p className="mt-2 text-white">{quantity}</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                          <p>Estimated charge</p>
                          <p className="mt-2 text-white">{calculateData ? `$${calculateData.charge.toFixed(2)}` : "—"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <button onClick={handleBack} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-blue">
                      Back
                    </button>
                    <button onClick={handlePlaceOrder} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7689ff] disabled:cursor-not-allowed disabled:opacity-60">
                      {saving ? "Placing order..." : "Place order"}
                    </button>
                  </div>
                </div>
              ) : currentStep >= 6 ? (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Order tracking</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Live status updates</h2>
                      </div>
                      <Sparkles className="text-brand-blue" size={24} />
                    </div>

                    <div className="mt-6 space-y-4">
                      {orderDetail ? (
                        <>
                          <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                            <div className="flex items-center justify-between gap-4">
                              <p>Order ID</p>
                              <p className="font-semibold text-white">#{orderDetail.id}</p>
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                              <p>Status</p>
                              <p className="mt-2 text-white">{orderDetail.status}</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                              <p>Network</p>
                              <p className="mt-2 text-white">{orderDetail.service_platform}</p>
                            </div>
                          </div>
                          <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                            <p>Campaign link</p>
                            <p className="mt-2 text-white truncate">{orderDetail.link}</p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                              <p>Quantity</p>
                              <p className="mt-2 text-white">{orderDetail.quantity}</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-4">
                              <p>Cost</p>
                              <p className="mt-2 text-white">${orderDetail.charge.toFixed(2)}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-10 text-center text-slate-400">Waiting for order status…</div>
                      )}
                    </div>
                  </div>

                  {orderDetail && finalStatuses.includes(orderDetail.status.toLowerCase()) ? (
                    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-emerald-100">
                      <p className="font-semibold">Order complete</p>
                      <p className="mt-2 text-sm text-slate-100">Your order has reached a final state. You can view the full campaign details in your orders page.</p>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-slate-300">
                      <p className="font-semibold">Live tracking active</p>
                      <p className="mt-2 text-sm">The order status refreshes every 60 seconds until the campaign is completed.</p>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <Link href="/orders" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-blue">
                      View all orders
                    </Link>
                    <button onClick={handleBack} className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7689ff]">
                      Back to order flow
                    </button>
                  </div>
                </div>
              ) : null}

              {stepError ? <div className="mt-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">{stepError}</div> : null}
              {orderError ? <div className="mt-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">{orderError}</div> : null}
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Order summary</p>
                    <p className="mt-2 text-lg font-semibold text-white">{selectedService ? selectedService.name : "Ready when you are"}</p>
                  </div>
                  <Sparkles className="text-brand-blue" />
                </div>

                <div className="mt-6 space-y-4 text-slate-300">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-4">
                      <p>Platform</p>
                      <p className="mt-2 text-white">{selectedService?.platform || selectedPlatform}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-4">
                      <p>Status</p>
                      <p className="mt-2 text-white">{orderDetail?.status || "Draft"}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-4">
                    <p>Selected quantity</p>
                    <p className="mt-2 text-white">{quantity || "—"}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-4">
                    <p>Wallet balance</p>
                    <p className="mt-2 text-white">${user?.balance ? Number(user.balance).toFixed(2) : "0.00"}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-4">
                    <p>Next action</p>
                    <p className="mt-2 text-white">{currentStep >= 6 ? "Track your campaign" : "Continue through the ordering steps"}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
