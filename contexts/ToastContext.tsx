"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: ToastMessage = { id, message, type };
    setToasts((current) => [...current, toast]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      <div className="relative min-h-screen">
        <div className="fixed right-4 top-4 z-50 flex w-[min(100%,380px)] flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`rounded-3xl border px-4 py-3 text-sm shadow-2xl shadow-black/20 transition ${
                toast.type === "success"
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                  : toast.type === "error"
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-100"
                  : toast.type === "warning"
                  ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
                  : "border-slate-400/20 bg-slate-900/80 text-slate-100"
              }`}
            >
              <p className="font-semibold uppercase tracking-[0.18em] text-xs text-slate-300">{toast.type}</p>
              <p className="mt-2 text-sm leading-6">{toast.message}</p>
            </div>
          ))}
        </div>
        {children}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
