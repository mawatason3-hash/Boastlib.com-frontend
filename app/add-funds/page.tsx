import { Sidebar } from "../components/Sidebar";
import { CreditCard, Globe, ShieldCheck } from "lucide-react";

const countries = ["Nigeria", "Ghana", "Kenya", "Rwanda", "Uganda"];
const methods = [
  { title: "Credit/Debit Card", gateway: "Paystack", available: true },
  { title: "MTN Mobile Money", gateway: "DPO/PawaPay", available: false },
  { title: "Airtel Money", gateway: "DPO/PawaPay", available: false },
];

export default function AddFundsPage() {
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
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Supported by Paystack</p>
                <p className="mt-1">Card payments and country-specific mobile money.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_0.5fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="grid gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Country</p>
                  <select className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                    {countries.map((country) => <option key={country}>{country}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Payment method</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {methods.map((method) => (
                      <button key={method.title} className={`rounded-3xl border px-5 py-5 text-left ${method.available ? 'border-brand-blue bg-slate-900' : 'border-white/10 bg-slate-950/80 opacity-70'} text-white`}>
                        <p className="font-semibold">{method.title}</p>
                        <p className="mt-2 text-sm text-slate-400">{method.gateway}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Quick amount</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {['$5','$10','$25','$50','$100'].map((value) => (
                      <button key={value} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-brand-blue">{value}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.3em] text-brand-gold">Custom amount</label>
                  <input className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" placeholder="$" />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">Order summary</p>
                    <p className="mt-2 text-3xl font-semibold">$25.00</p>
                  </div>
                  <CreditCard className="text-brand-blue" />
                </div>
                <div className="mt-6 space-y-3 text-sm text-slate-400">
                  <div className="flex justify-between"><span>Processing fee</span><span>$0.00</span></div>
                  <div className="flex justify-between"><span>Bonus</span><span>$0.00</span></div>
                </div>
                <div className="mt-6 rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                  <p>Total credited</p>
                  <p className="mt-2 text-2xl font-semibold text-white">$25.00</p>
                </div>
                <button className="mt-6 w-full rounded-3xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white">Proceed to Payment</button>
                <div className="mt-6 grid gap-3 text-sm text-slate-400">
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3"><ShieldCheck size={16} /> SSL Secured</div>
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3"><Globe size={16} /> Instant Credit</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
