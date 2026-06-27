"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";

type WalletData = {
  balance: number;
  isPremium: boolean;
  exchangeRate: string;
  redeemOptions: { id: string; label: string; cost: number; description: string }[];
  transactions: { id: string; amount: number; reason: string; createdAt: string; metadata: string | null }[];
};

export default function WalletPage() {
  const [data, setData] = useState<WalletData | null>(null);
  const [user, setUser] = useState<{ displayName: string; moodCoins: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch("/api/wallet").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ]).then(([wallet, me]) => {
      if (!me.user) {
        router.push("/login");
        return;
      }
      setUser({ displayName: me.user.displayName, moodCoins: me.user.moodCoins });
      setData(wallet);
      setLoading(false);
    });
  }, [router]);

  async function redeem(optionId: string) {
    setRedeeming(optionId);
    setMessage("");
    const res = await fetch("/api/wallet/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    const result = await res.json();
    setRedeeming(null);
    if (res.ok) {
      setMessage(result.message);
      const wallet = await fetch("/api/wallet").then((r) => r.json());
      setData(wallet);
      setUser((u) => (u ? { ...u, moodCoins: result.balance } : u));
    } else {
      setMessage(result.error);
    }
  }

  if (loading || !data || !user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-400">Loading...</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <Card>
          <p className="text-sm text-slate-400">Your balance</p>
          <p className="text-4xl font-bold text-white">{data.balance} MoodCoins</p>
          <p className="mt-1 text-sm text-violet-300">{data.exchangeRate}</p>
          {data.isPremium && (
            <span className="mt-2 inline-block rounded-full bg-violet-500/30 px-3 py-1 text-xs text-violet-200">
              Premium active
            </span>
          )}
        </Card>

        <Card title="Earn coins">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-black/20 p-3">❤️ Like = 1 coin</div>
            <div className="rounded-lg bg-black/20 p-3">👍 Helpful = 5 coins</div>
            <div className="rounded-lg bg-black/20 p-3">🔖 Save = 3 coins</div>
            <div className="rounded-lg bg-black/20 p-3">📤 Share = 5 coins</div>
          </div>
        </Card>

        <Card title="Redeem (demo)">
          {message && <p className="mb-3 text-sm text-violet-300">{message}</p>}
          <div className="space-y-3">
            {data.redeemOptions.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div>
                  <p className="font-medium text-white">{opt.label}</p>
                  <p className="text-xs text-slate-400">{opt.description}</p>
                </div>
                <button
                  onClick={() => redeem(opt.id)}
                  disabled={redeeming === opt.id || data.balance < opt.cost}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-40"
                >
                  {opt.cost} coins
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent transactions">
          {data.transactions.length === 0 ? (
            <p className="text-sm text-slate-500">No transactions yet. Get reactions on your posts!</p>
          ) : (
            <ul className="space-y-2">
              {data.transactions.map((tx) => (
                <li key={tx.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">{tx.reason.replace(/_/g, " ")}</span>
                  <span className={tx.amount > 0 ? "text-green-400" : "text-red-400"}>
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </div>
  );
}
