"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { CreditCard, Globe, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";

const countries = ["Nigeria", "Ghana", "Kenya", "Rwanda", "Uganda"];
const quickAmounts = [5, 10, 25, 50, 100];

type GatewayOption = {
  method_type: string;
  gateway: string;
};

export default function AddFundsPage() {
  const user = getUser();
  const walletBalance = user?.balance ? Number(user.balance).toFixed(2) : "0.00";
  const [country, setCountry] = useState(countries[0]);
  const [gateways, setGateways] = useState<GatewayOption[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>("Paystack");
  const [amount, setAmount] = useState(25);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [loadingGateways, setLoadingGateways] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const loadGateways = async () => {
      setLoadingGateways(true);
      setPaymentMessage(null);
      try {
        const response = await api.post<GatewayOption[]>("/funds/country", { country });
        setGateways(response.data || []);
        if (response.data?.length) {
          setSelectedGateway(response.data[0].gateway);
        }
      } catch (err: any) {
        setGateways([]);
        setPaymentMessage(err.response?.data?.error || "Unable to load payment options.");
      } finally {
        setLoadingGateways(false);
      }
    };

    loadGateways();
  }, [country]);

  const selectedGatewayOption = gateways.find((gateway) => gateway.gateway === selectedGateway);

  const formatGatewayTitle = (gateway: GatewayOption) => {
    if (gateway.gateway.toLowerCase() === "paystack") return "Credit/Debit Card";
    if (gateway.method_type === "momo") return `${gateway.gateway} Mobile Money`;
    return gateway.gateway;
  };

  const handlePayment = async () => {
    setPaymentMessage(null);
    if (!user?.email) {
      setPaymentMessage("Please sign in to add funds.");
      return;
    }
    if (!selectedGatewayOption) {
      setPaymentMessage("Select a payment gateway first.");
      return;
    }
    if (selectedGatewayOption.gateway.toLowerCase() !== "paystack") {
      setPaymentMessage(`Payment via ${selectedGatewayOption.gateway} is not supported from this page yet.`);
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await api.post("/funds/paystack/init", {
        amount,
        email: user.email,
      });
      const init = response.data as { authorization_url?: string };
      if (init.authorization_url) {
        window.open(init.authorization_url, "_blank");
        setPaymentMessage("Paystack checkout opened in a new tab.");
      } else {
        setPaymentMessage("Payment initialized. Complete checkout in the provider UI.");
      }
    } catch (err: any) {
      setPaymentMessage(err.response?.data?.error || "Unable to initiate payment.");
    } finally {
      setPaymentLoading(false);
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
                <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Add Funds</p>
                <h1 className="mt-2 text-3xl font-semibold">Top up your wallet</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-400">Keep campaigns funded with fast payment options and immediate wallet credit.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Available balance</p>
                <p className="mt-1 text-2xl font-semibold text-white">${walletBalance}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_0.5fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="grid gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Country</p>
                  <select
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  >
                    {countries.map((countryOption) => (
                      <option key={countryOption} value={countryOption}>
                        {countryOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Payment method</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {loadingGateways ? (
                      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-400">Loading payment gateways…</div>
                    ) : gateways.length === 0 ? (
                      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-400">No payment methods available for this country.</div>
                    ) : (
                      gateways.map((gateway) => (
                        <button
                          key={gateway.gateway}
                          type="button"
                          onClick={() => setSelectedGateway(gateway.gateway)}
                          className={`rounded-3xl border px-5 py-5 text-left transition ${
                            selectedGateway === gateway.gateway
                              ? "border-brand-blue bg-slate-900 text-white"
                              : "border-white/10 bg-slate-950/80 text-white hover:border-slate-400"
                          }`}
                        >
                          <p className="font-semibold">{formatGatewayTitle(gateway)}</p>
                          <p className="mt-2 text-sm text-slate-400">{gateway.gateway}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Quick amount</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(value)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          amount === value ? "border-brand-blue bg-brand-blue/10 text-white" : "border-white/10 text-slate-300 hover:border-brand-blue"
                        }`}
                      >
                        ${value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.3em] text-brand-gold">Custom amount</label>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value) || 0)}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    placeholder="$"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Order summary</p>
                    <p className="mt-2 text-3xl font-semibold text-white">${amount.toFixed(2)}</p>
                  </div>
                  <CreditCard className="text-brand-blue" />
                </div>
                <div className="mt-6 space-y-3 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Payment gateway</span>
                    <span>{selectedGatewayOption?.gateway ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Country</span>
                    <span>{country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee estimate</span>
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="mt-6 rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                  <p>Total credited</p>
                  <p className="mt-2 text-2xl font-semibold text-white">${amount.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={paymentLoading || !selectedGatewayOption}
                  className="mt-6 w-full rounded-3xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#7689ff]"
                >
                  {paymentLoading ? "Processing…" : "Proceed to Payment"}
                </button>
                {paymentMessage ? (
                  <p className="mt-4 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-200">{paymentMessage}</p>
                ) : null}
                <div className="mt-6 grid gap-3 text-sm text-slate-400">
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3">
                    <ShieldCheck size={16} /> SSL Secured
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3">
                    <Globe size={16} /> Instant Credit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
