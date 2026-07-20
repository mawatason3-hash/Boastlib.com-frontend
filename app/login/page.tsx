"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (result.success) {
      showToast("Logged in successfully.", "success");
      router.push("/dashboard");
      return;
    }
    setError(result.error || "Login failed");
  };

  const handleGoogleLogin = () => {
    window.location.href = `${window.location.origin}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold">Login to your account</h1>
        <p className="mt-2 text-slate-400">Enter your credentials to access the dashboard.</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-blue" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-blue" />
          </label>
          {error ? <div className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-300">{error}</div> : null}
          <button type="submit" className="w-full rounded-3xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white">Login</button>
        </form>
        <div className="mt-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
            <div className="h-px flex-1 bg-white/10" />
            <span>or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <button type="button" onClick={handleGoogleLogin} className="mt-4 flex w-full items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            <span className="text-lg">G</span>
            Continue with Google
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-slate-400">
          <button className="text-brand-purple hover:text-brand-blue">Forgot password?</button>
        </div>
      </div>
    </div>
  );
}
