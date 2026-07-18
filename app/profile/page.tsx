"use client";

import { Sidebar } from "../components/Sidebar";
import { logout, getUser } from "../../lib/auth";

export default function ProfilePage() {
  const user = getUser() || { full_name: "Alex", email: "alex@example.com" };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Profile</p>
            <h1 className="mt-2 text-3xl font-semibold">Your account</h1>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Personal info</p>
                <div className="mt-6 space-y-4 text-sm text-slate-300">
                  <div>
                    <p className="text-slate-400">Name</p>
                    <p className="mt-2 font-semibold text-white">{user.full_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Email</p>
                    <p className="mt-2 font-semibold text-white">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Security</p>
                <div className="mt-6 space-y-4">
                  <label className="block text-sm text-slate-300">New password</label>
                  <input type="password" className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="••••••••" />
                  <label className="block text-sm text-slate-300">Confirm password</label>
                  <input type="password" className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="••••••••" />
                  <button className="w-full rounded-3xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white">Save changes</button>
                </div>
              </div>
            </div>
            <button onClick={logout} className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-3 text-sm text-slate-200">Logout</button>
          </div>
        </section>
      </div>
    </main>
  );
}
