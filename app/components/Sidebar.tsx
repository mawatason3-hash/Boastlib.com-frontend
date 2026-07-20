"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Home, ShoppingBag, CreditCard, Layers, Activity, User, Code2, LogOut } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/new-order", label: "New Order", icon: ShoppingBag },
  { href: "/orders", label: "My Orders", icon: Activity },
  { href: "/add-funds", label: "Add Funds", icon: CreditCard },
  { href: "/services", label: "Services", icon: Layers },
  { href: "/transactions", label: "Transactions", icon: Activity },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/developer", label: "Developer", icon: Code2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const balance = user?.balance ? Number(user.balance).toFixed(2) : "0.00";

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 text-sm text-slate-300 lg:flex">
      <div className="mb-6">
        <div className="mb-5 text-xl font-semibold text-white">BOASTLIB</div>
        {user?.fullName ? (
          <div className="rounded-3xl bg-slate-900/70 p-4 text-slate-300">
            <p className="text-sm font-semibold text-white">{user.fullName}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">Wallet balance</p>
            <p className="mt-3 text-2xl font-semibold text-white">${balance}</p>
          </div>
        ) : null}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/dashboard/new-order" && pathname.startsWith("/dashboard/new-order"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-3xl px-4 py-3 transition ${
                isActive ? "bg-brand-blue/10 text-white border border-brand-blue" : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <button
        type="button"
        onClick={logout}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
      >
        <LogOut size={18} /> Sign out
      </button>
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">
        <p className="font-semibold text-white">Need help?</p>
        <p className="mt-2">Contact support or visit the Developer page for reseller docs.</p>
      </div>
    </aside>
  );
}
