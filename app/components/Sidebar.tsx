"use client";

import Link from "next/link";
import { Home, ShoppingBag, CreditCard, Layers, Activity, User, Code2, LogOut } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/new-order", label: "New Order", icon: ShoppingBag },
  { href: "/orders", label: "My Orders", icon: Activity },
  { href: "/add-funds", label: "Add Funds", icon: CreditCard },
  { href: "/services", label: "Services", icon: Layers },
  { href: "/transactions", label: "Transactions", icon: Activity },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/developer", label: "Developer", icon: Code2 },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 text-sm text-slate-300 lg:flex">
      <div className="mb-6 text-xl font-semibold text-white">BOASTLIB</div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-3xl px-4 py-3 text-slate-300 transition hover:bg-slate-900 hover:text-white">
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto rounded-3xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">
        <p className="font-semibold text-white">Need help?</p>
        <p className="mt-2">Contact support or visit the Developer page for reseller docs.</p>
      </div>
    </aside>
  );
}
