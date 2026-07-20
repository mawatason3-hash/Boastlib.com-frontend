import Link from "next/link";
import { ArrowRight, Zap, MessageCircle } from "lucide-react";
import { ServiceSearch } from "./components/ServiceSearch";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiTelegram, SiSpotify, SiDiscord } from "react-icons/si";

const platforms = [
  { name: "Instagram", icon: SiInstagram, color: "from-pink-500 to-orange-400" },
  { name: "TikTok", icon: SiTiktok, color: "from-slate-300 to-slate-500" },
  { name: "YouTube", icon: SiYoutube, color: "from-red-500 to-orange-500" },
  { name: "Facebook", icon: SiFacebook, color: "from-blue-500 to-cyan-500" },
  { name: "X", icon: SiX, color: "from-slate-500 to-slate-700" },
  { name: "Telegram", icon: SiTelegram, color: "from-sky-400 to-blue-600" },
  { name: "Spotify", icon: SiSpotify, color: "from-green-500 to-emerald-500" },
  { name: "Discord", icon: SiDiscord, color: "from-violet-500 to-fuchsia-500" },
];

const faqItems = [
  { question: "How do I start using BoastLib?", answer: "Register free, add funds, and place your first service order in minutes." },
  { question: "Are prices based on real provider rates?", answer: "Yes. Our public pricing preview pulls directly from active service rates in the database." },
  { question: "Do I need an account to browse services?", answer: "No. The landing page is public and does not show any user-specific wallet or order data." },
];

import { fetchBackend } from "@/lib/backend";

async function fetchPublicStats() {
  try {
    const response = await fetchBackend("/api/stats/public");
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as Array<{ platform: string; cheapestRate: number; serviceCount: number }>;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const stats = await fetchPublicStats();
  const pricingCards = stats.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple text-white shadow-lg shadow-brand-blue/20">
              <Zap className="h-5 w-5" />
            </span>
            BOASTLIB
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <Link href="#home" className="transition hover:text-white">Home</Link>
            <Link href="#services" className="transition hover:text-white">Services</Link>
            <Link href="#pricing" className="transition hover:text-white">Pricing</Link>
            <Link href="#faq" className="transition hover:text-white">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white">Login</Link>
            <Link href="/register" className="hidden rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-5 py-2 text-sm font-semibold text-white transition hover:opacity-95 md:inline-flex">Register</Link>
          </div>
        </div>
      </header>

      <section id="home" className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <ServiceSearch placeholder="Search services across all supported platforms" />
            <div className="inline-flex rounded-full bg-orange-200/10 px-4 py-2 text-sm uppercase tracking-[0.35em] text-brand-gold shadow-sm shadow-orange-500/10">SMM PANEL</div>
            <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl">Boost Your Social Media. Instantly.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">A modern SMM panel for resellers and agencies. Browse services, compare real platform pricing, and launch social campaigns without fake metrics or account-specific data on the public landing page.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition hover:opacity-95">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white">View Services</Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-brand-blue/20 to-transparent" />
            <div className="relative grid gap-4 sm:grid-cols-2">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.name} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg shadow-black/10">
                    <span className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${platform.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Platform</p>
                      <p className="text-lg font-semibold text-white">{platform.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-white/5" />
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-white/10 bg-slate-950/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Platform support</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">All supported networks</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.name} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 transition hover:border-brand-blue/40">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${platform.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{platform.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">How it works</p>
            <h2 className="text-3xl font-semibold text-white">Launch orders in three simple steps</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Register Free", description: "Create your account and access the BoastLib platform instantly." },
                { step: "02", title: "Add Funds", description: "Fund your wallet with secure payment options and start buying services." },
                { step: "03", title: "Place Order", description: "Choose a service, enter your campaign details, and submit your order." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-blue to-brand-purple text-lg font-semibold text-white">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-brand-blue/10 to-slate-900/20 p-8">
            <div className="absolute inset-x-0 top-10 h-10 bg-white/5 blur-2xl" />
            <div className="relative space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Why BoastLib</p>
                <p className="mt-4 text-lg font-semibold text-white">A clean landing page with real pricing data and no user wallet exposure.</p>
                <p className="mt-3 text-slate-400">Our public marketing pages never display logged-in account balances or invented social-proof claims.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-white/10 bg-slate-950/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Pricing preview</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Cheapest active service by platform</h2>
            <p className="mt-3 max-w-2xl mx-auto text-slate-400">These cards show the lowest active marketplace price for each supported platform, sourced from live service data.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {pricingCards.length > 0 ? (
              pricingCards.map((card) => (
                <div key={card.platform} className="rounded-3xl border border-white/10 bg-slate-950/80 p-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{card.platform}</p>
                  <p className="mt-4 text-4xl font-semibold text-white">${card.cheapestRate.toFixed(4)} / 1K</p>
                  <p className="mt-4 text-slate-400">Active services: {card.serviceCount}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-400">No active pricing data is available at this time.</div>
            )}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-6 py-16">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">FAQ</p>
          <h2 className="text-3xl font-semibold text-white">Frequently asked questions</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <p className="mt-3 text-slate-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/90 py-12 text-slate-400">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-4 text-2xl font-semibold text-white">BOASTLIB</div>
            <p className="max-w-md text-slate-400">A secure social media marketing panel for resellers and agencies. No account data on public pages.</p>
          </div>
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-brand-gold">Product</p>
            <div className="space-y-3 text-sm">
              <Link href="#home" className="block text-slate-400 transition hover:text-white">Home</Link>
              <Link href="#services" className="block text-slate-400 transition hover:text-white">Services</Link>
              <Link href="#pricing" className="block text-slate-400 transition hover:text-white">Pricing</Link>
              <Link href="#faq" className="block text-slate-400 transition hover:text-white">FAQ</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-brand-gold">Follow</p>
            <div className="flex flex-wrap gap-3 text-slate-400">
              <Link href="#" className="transition hover:text-white">Twitter</Link>
              <Link href="#" className="transition hover:text-white">Discord</Link>
              <Link href="#" className="transition hover:text-white">Telegram</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">© 2026 BoastLib. Built for secure, scalable SMM reselling.</div>
      </footer>
    </main>
  );
}
