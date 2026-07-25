"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Sign in failed");
        return;
      }
      router.replace(params.get("from") || "/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0C0E] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border-[1.5px] border-[#1CAFE8]">
            <div className="h-3.5 w-3.5 bg-[#1CAFE8]" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold tracking-[0.14em] text-white">FERUMS</div>
            <div className="text-[9px] font-semibold tracking-[0.3em] text-white/60">ADMIN</div>
          </div>
        </div>

        <div className="border border-white/10 bg-white/[0.03] p-7 backdrop-blur">
          <h1 className="text-xl font-bold text-white">Sign in</h1>
          <p className="mt-1 text-sm text-white/50">Welcome back to the control panel</p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Email</span>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="border border-white/15 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#1CAFE8]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Password</span>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-white/15 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#1CAFE8]"
              />
            </label>

            {error && <div className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}

            <button
              type="submit" disabled={loading}
              className="mt-2 bg-[#1CAFE8] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#1690C0] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
