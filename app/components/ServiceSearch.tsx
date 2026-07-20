"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { SiFacebook, SiInstagram, SiSpotify, SiTelegram, SiTiktok, SiYoutube, SiDiscord, SiX } from "react-icons/si";
import api from "@/lib/api";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram: SiInstagram,
  TikTok: SiTiktok,
  YouTube: SiYoutube,
  Facebook: SiFacebook,
  X: SiX,
  Twitter: SiX,
  Telegram: SiTelegram,
  Spotify: SiSpotify,
  Discord: SiDiscord,
};

type ServiceResult = {
  id: string;
  platform: string;
  category: string;
  name: string;
  rate_per_1000: number;
};

type ServiceSearchProps = {
  placeholder?: string;
};

export function ServiceSearch({ placeholder = "Search services by platform, category or name" }: ServiceSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ServiceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasQueried, setHasQueried] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    setHasQueried(true);
    setLoading(true);
    setError(null);

    const timer = window.setTimeout(async () => {
      try {
        const response = await api.get<ServiceResult[]>(`/public/services/search?q=${encodeURIComponent(trimmed)}`);
        setResults(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to fetch search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  const showDropdown = useMemo(
    () => query.trim().length > 0 && (loading || results.length > 0 || hasQueried),
    [query, loading, results.length, hasQueried]
  );

  return (
    <div className="relative max-w-3xl">
      <div className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-200 shadow-sm shadow-slate-950/20">
        <FiSearch className="h-5 w-5 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>
      {showDropdown ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/95 shadow-2xl shadow-black/30">
          {loading ? (
            <div className="p-4 text-sm text-slate-400">Searching services…</div>
          ) : error ? (
            <div className="p-4 text-sm text-rose-200">{error}</div>
          ) : results.length > 0 ? (
            results.map((service) => {
              const Icon = platformIcons[service.platform] || SiX;
              return (
                <Link
                  key={service.id}
                  href={`/new-order?serviceId=${service.id}`}
                  className="flex items-center gap-3 border-b border-slate-800 px-4 py-3 text-sm text-slate-100 transition hover:bg-slate-900"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="truncate font-semibold text-white">{service.name}</p>
                    <p className="truncate text-slate-400">{service.platform} • {service.category}</p>
                  </div>
                  <div className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">${service.rate_per_1000.toFixed(2)}/1K</div>
                </Link>
              );
            })
          ) : (
            <div className="space-y-3 px-4 py-4 text-sm text-slate-300">
              <p>No matching service found — browse all services.</p>
              <Link href="/services" className="inline-flex rounded-full bg-brand-blue px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:opacity-90">
                Browse services
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
