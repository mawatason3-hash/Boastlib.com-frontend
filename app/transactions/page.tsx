"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import api from "@/lib/api";

type Transaction = {
  id: string;
  type: string;
  amount: number | string;
  gateway: string;
  status: string;
  balance_after?: number | string;
  created_at?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Transaction[]>("/transactions");
        setTransactions(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Transactions</p>
            <h1 className="mt-2 text-3xl font-semibold">Ledger history</h1>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Loading transactions…</div>
              ) : error ? (
                <div className="p-8 text-center text-rose-300">{error}</div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No transactions are available yet.</div>
              ) : (
                <table className="min-w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-white/10 bg-slate-950/80 text-slate-400">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Gateway</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-white/10 last:border-b-0 hover:bg-slate-950/60">
                        <td className="px-6 py-4 text-brand-blue">{transaction.id}</td>
                        <td className="px-6 py-4">{transaction.type}</td>
                        <td className="px-6 py-4">{typeof transaction.amount === "number" ? `$${transaction.amount.toFixed(2)}` : transaction.amount}</td>
                        <td className="px-6 py-4">{transaction.gateway}</td>
                        <td className="px-6 py-4">{transaction.status}</td>
                        <td className="px-6 py-4">{transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
