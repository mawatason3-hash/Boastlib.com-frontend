"use client";

import { Sidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function DeveloperPage() {
  const [info, setInfo] = useState<{ name: string; contact: string; credit_line: string } | null>(null);
  const [form, setForm] = useState({ name: "", organization: "", useCase: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/developer/info").then((res) => setInfo(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    try {
      await api.post("/developer/request-key", form);
      setMessage("Request submitted. Await admin approval.");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Unable to submit request.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Developer</p>
            <h1 className="mt-2 text-3xl font-semibold">Reseller API & contact info</h1>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <h2 className="text-xl font-semibold text-white">Reseller API</h2>
              <p className="mt-3 text-slate-400">Use BoastLib as an upstream provider with the following endpoint shape.</p>
              <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-300">
                <p><span className="font-semibold text-white">Base URL:</span> {process.env.NEXT_PUBLIC_API_URL || "https://api.your-backend.com"}</p>
                <p><span className="font-semibold text-white">GET</span> /developer/docs</p>
                <p><span className="font-semibold text-white">POST</span> /developer/request-key</p>
                <p><span className="font-semibold text-white">GET</span> /services</p>
                <p><span className="font-semibold text-white">POST</span> /orders</p>
                <p><span className="font-semibold text-white">GET</span> /orders/:id</p>
              </div>
              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm text-slate-300">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
                <label className="block text-sm text-slate-300">Organization</label>
                <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
                <label className="block text-sm text-slate-300">Use case</label>
                <textarea value={form.useCase} onChange={(e) => setForm({ ...form, useCase: e.target.value })} className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" rows={4} />
                <button className="w-full rounded-3xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white">Request API Access</button>
              </form>
              {message ? <p className="mt-4 rounded-3xl bg-brand-blue/10 p-4 text-sm text-brand-blue">{message}</p> : null}
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <h2 className="text-xl font-semibold text-white">Built by</h2>
              <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-300">
                <p className="text-slate-400">Developer</p>
                <p className="mt-2 text-xl font-semibold text-white">{info?.name || "Solomon"}</p>
                <p className="mt-2">{info?.credit_line || "Built by Solomon"}</p>
                <p className="mt-4 text-slate-400">Contact:</p>
                <p className="mt-1 text-white">{info?.contact || "support@boastlib.com"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

