"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { DemoUserChip } from "@/components/DemoUserChip";
import { DEMO_LOGIN_ACCOUNTS } from "@/lib/demo-content";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-4 py-12">
        <Card title="Welcome back">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-400">
            No account?{" "}
            <Link href="/register" className="text-violet-400 hover:underline">
              Register
            </Link>
          </p>
        </Card>

        <Card title="Try demo accounts" className="mt-6">
          <p className="mb-3 text-sm text-slate-400">
            All demo users use password <span className="font-mono text-slate-300">demo1234</span>.
            Posts show a small <DemoUserChip /> badge.
          </p>
          <div className="space-y-2">
            {DEMO_LOGIN_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword("demo1234");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-left text-sm hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <span className="text-slate-200">
                  {account.alias}
                  <span className="ml-2 text-xs text-slate-500">{account.email}</span>
                </span>
                <DemoUserChip />
              </button>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
