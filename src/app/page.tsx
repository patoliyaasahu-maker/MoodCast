import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Heart, Users, Sparkles, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <section className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            Emotional social network
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Share how you feel.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Not how you look.
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Daily mood check-in. Get matched with 8–12 people feeling something similar.
            24-hour rooms. Reactions only — no comments. Earn MoodCoins for genuine connection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-3 font-medium text-white"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-8 py-3 font-medium text-white hover:bg-white/5"
            >
              Log in
            </Link>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Heart,
              title: "Daily check-in",
              desc: "Describe your mood in your own words. We match you instantly.",
            },
            {
              icon: Users,
              title: "24-hour rooms",
              desc: "Up to 12 strangers who get it today. Gone tomorrow.",
            },
            {
              icon: Shield,
              title: "Reactions only",
              desc: "Like, Helpful, Save, Share — no comment toxicity.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <Icon className="mb-3 h-8 w-8 text-violet-400" />
              <h3 className="mb-2 font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm text-slate-400">MoodCoin economy (demo)</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            ❤️ 1 · 👍 5 · 🔖 3 · 📤 5 coins per reaction
          </p>
        </section>
      </main>
    </div>
  );
}
