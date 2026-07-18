"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", agree: false });
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords must match");
      return;
    }
    try {
      const response = await api.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("boastlib_token", response.data.token);
      localStorage.setItem("boastlib_user", JSON.stringify(response.data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold">Create Your Account</h1>
        <p className="mt-2 text-slate-400">Sign up and start boosting your social media accounts.</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-300">Full Name</span>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-blue" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Email Address</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-blue" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-blue" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Confirm Password</span>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-blue" />
          </label>
          <label className="flex items-center gap-3 text-slate-300">
            <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-brand-blue" />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>
          {error ? <div className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-300">{error}</div> : null}
          <button type="submit" disabled={!form.agree} className="w-full rounded-3xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Create Account — It’s Free</button>
        </form>
      </div>
    </div>
  );
}
