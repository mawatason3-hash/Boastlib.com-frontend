import { Sidebar } from "../../components/Sidebar";

const transactions = [
  { id: "TX1001", type: "Deposit", amount: "$50.00", gateway: "Paystack", status: "Completed", date: "12/05/2023" },
  { id: "TX1002", type: "Refund", amount: "$10.00", gateway: "Paystack", status: "Completed", date: "12/04/2023" },
];

export default function AdminTransactionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Admin transactions</p>
            <h1 className="mt-2 text-3xl font-semibold">Payment ledger</h1>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80">
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
                      <td className="px-6 py-4">{transaction.amount}</td>
                      <td className="px-6 py-4">{transaction.gateway}</td>
                      <td className="px-6 py-4">{transaction.status}</td>
                      <td className="px-6 py-4">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
