"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ServiceSearch } from "../components/ServiceSearch";
import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiTelegram, SiSpotify, SiDiscord, SiTwitch, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";

type Order = {
  id: string;
  service: string;
  charge: number;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const walletBalance = user?.balance ? Number(user.balance).toFixed(2) : "0.00";
  const totalOrders = orders.length;
  const completedOrders = orders.filter((order) => order.status?.toLowerCase() === "completed").length;
  const pendingOrders = orders.filter((order) => order.status?.toLowerCase() !== "completed").length;
  const recentOrders = orders.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#070b16] px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <ServiceSearch />
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            {/* Platform icons moved out of absolute positioning into a responsive grid to avoid overlap */}
            <div className="mt-6 lg:mt-0 lg:ml-8 lg:flex lg:items-center">
              <div className="grid grid-cols-5 gap-3 lg:grid-cols-3">
                {[SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiTelegram, SiSpotify, SiDiscord, FaLinkedin, SiTwitch].map((Icon, index) => (
                  <div key={index} className="flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/90 shadow-lg shadow-slate-950/20">
                    <Icon className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-[#ffc85c]">BoastLib Dashboard</p>
                  <span className="rounded-full border border-[#ffc85c]/20 bg-[#ffc85c]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#ffc85c]">Live</span>
                </div>
                <h1 className="text-5xl font-semibold leading-tight text-white">Boost your social media reselling with real-time wallet and order control.</h1>
                <p className="max-w-xl text-slate-300">Monitor wallet funds, recent order activity, and top metrics with the same polished SMM panel look as the homepage prototype.</p>
                <div className="flex flex-wrap gap-4">
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#ffc85c] px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[#ffc85c]/20 transition hover:bg-[#ffe27d]">
                    Start order <ArrowRight size={18} />
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-[#ffc85c]/20 bg-[#ffc85c]/10 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-[#ffc85c]/15">
                    View services
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.9fr_0.9fr]">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current Balance</p>
                  <p className="mt-4 text-4xl font-semibold text-white">${walletBalance}</p>
                  <p className="mt-2 text-sm text-slate-400">Available in wallet</p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] p-6 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#5a6dff]/20 blur-3xl"></div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live Orders</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{loading ? "…" : totalOrders.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-slate-400">Updated continuously</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiTelegram, SiSpotify, SiDiscord, FaLinkedin, SiTwitch].map((Icon, index) => (
                      <div key={index} className="flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/90 shadow-lg shadow-slate-950/20">
                        <Icon className="h-5 w-5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-4">
            {[
              { label: "Wallet", value: `$${walletBalance}`, meta: "Dynamic funds", icon: Sparkles },
              { label: "Orders", value: loading ? "…" : totalOrders.toLocaleString(), meta: "Orders created", icon: ArrowRight },
              { label: "Completed", value: loading ? "…" : completedOrders.toLocaleString(), meta: "Delivered", icon: CheckCircle2 },
              { label: "Pending", value: loading ? "…" : pendingOrders.toLocaleString(), meta: "In progress", icon: Clock },
            ].map((item) => (
              <div key={item.label} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_75px_rgba(15,23,42,0.25)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                  <item.icon className="h-10 w-10 rounded-3xl bg-[#111827] p-2 text-[#8c7cff]" />
                </div>
                <p className="mt-4 text-sm text-slate-400">{item.meta}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Quick Launch</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">New campaign</h2>
                </div>
                <ArrowRight className="text-brand-blue" />
              </div>
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-300">Order any service quickly from your dashboard.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder="Service or link" className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none" />
                  <input type="number" placeholder="Quantity" className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none" />
                </div>
                <button className="w-full rounded-3xl bg-brand-blue px-5 py-3 text-white transition hover:bg-[#7689ff]">Start now</button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Recent Orders</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Activity</h2>
                </div>
                <CheckCircle2 className="text-brand-blue" />
              </div>
              <div className="mt-6 space-y-4">
                {error ? (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
                ) : loading ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-500">Loading recent activity…</div>
                ) : recentOrders.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-400">No recent orders yet.</div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">#{order.id}</p>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{order.service || "Order item"}</p>
                          <p className="text-sm text-slate-400">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "Today"}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{order.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-8 lg:block">
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Support</p>
              <p className="mt-2 text-lg font-semibold text-white">24/7 live help</p>
            </div>
            <Sparkles className="text-brand-blue" />
          </div>
          <div className="mt-6 space-y-5">
            {/* Removed fabricated "Top stats" and "Pricing" cards to avoid displaying invented numbers. */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">About</p>
              <p className="mt-3 text-base text-slate-300">Real-time wallet and order information is shown using your account data. No fabricated metrics are displayed.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
