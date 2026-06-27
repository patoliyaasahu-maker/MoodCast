"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    city: "",
    anonymousAlias: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-4 py-12">
        <Card title="Create your account">
          <p className="mb-4 text-sm text-slate-400">
            Use an anonymous alias in rooms. Your real name stays private.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "displayName", label: "Display name", type: "text", required: true },
              { key: "anonymousAlias", label: "Anonymous alias (shown in rooms)", type: "text" },
              { key: "email", label: "Email", type: "email", required: true },
              { key: "password", label: "Password (min 6 chars)", type: "password", required: true },
              { key: "city", label: "City (optional)", type: "text" },
            ].map(({ key, label, type, required }) => (
              <div key={key}>
                <label className="mb-1 block text-sm text-slate-400">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                  required={required}
                  minLength={key === "password" ? 6 : undefined}
                />
              </div>
            ))}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
