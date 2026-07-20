"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const protectedPaths = ["/dashboard", "/dashboard/new-order", "/orders", "/add-funds", "/transactions", "/profile"];

function pathRequiresAuth(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const requiresAuth = pathRequiresAuth(pathname || "");

  useEffect(() => {
    if (!isLoading && requiresAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, requiresAuth, router]);

  if (requiresAuth && isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 px-8 py-12 text-center text-slate-300">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-gold">Checking session</p>
          <p className="mt-4 text-lg font-semibold text-white">Loading your BoastLib account...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
