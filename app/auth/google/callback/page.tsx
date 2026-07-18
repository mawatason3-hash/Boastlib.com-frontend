"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("boastlib_token", token);
        localStorage.setItem("boastlib_user", JSON.stringify(parsedUser));
        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <p className="text-sm text-slate-400">Finishing sign-in…</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><p className="text-sm text-slate-400">Finishing sign-in…</p></div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
