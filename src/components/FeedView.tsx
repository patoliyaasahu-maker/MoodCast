"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";

type FeedPost = Parameters<typeof PostCard>[0]["post"];
type MoodFilter = { label: string; count: number };

export function FeedView() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [moods, setMoods] = useState<MoodFilter[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [user, setUser] = useState<{ displayName: string; moodCoins: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (!me.user) {
        router.push("/login");
        return;
      }
      setUser({ displayName: me.user.displayName, moodCoins: me.user.moodCoins });

      const res = await fetch("/api/feed");
      const data = await res.json();
      setPosts(data.posts);
      setMoods(data.moods);
      setLoading(false);
    }
    init();
  }, [router]);

  async function filterByMood(mood: string | null) {
    setActiveMood(mood);
    setLoading(true);
    const url = mood ? `/api/feed?mood=${encodeURIComponent(mood)}` : "/api/feed";
    const res = await fetch(url);
    const data = await res.json();
    setPosts(data.posts);
    setMoods(data.moods);
    setLoading(false);
  }

  if (!user) {
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
        <div>
          <h1 className="text-2xl font-semibold text-white">MoodCast Feed</h1>
          <p className="mt-1 text-sm text-slate-400">
            Emotional thoughts that resonated — demo posts are marked with a Demo badge
          </p>
        </div>

        {moods.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => filterByMood(null)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition",
                !activeMood
                  ? "bg-violet-600 text-white"
                  : "border border-white/10 text-slate-400 hover:text-white"
              )}
            >
              All
            </button>
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => filterByMood(m.label)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs transition",
                  activeMood === m.label
                    ? "bg-violet-600 text-white"
                    : "border border-white/10 text-slate-400 hover:text-white"
                )}
              >
                {m.label} ({m.count})
              </button>
            ))}
          </div>
        )}

        <Card>
          <p className="text-sm text-slate-300">
            Publish from your room: check <strong className="text-white">&quot;Also publish to MoodCast Feed&quot;</strong> when posting, or tap <strong className="text-white">Publish to Feed</strong> on any of your posts.
          </p>
        </Card>

        {loading ? (
          <p className="text-center text-slate-400">Loading feed...</p>
        ) : posts.length === 0 ? (
          <Card>
            <p className="text-center text-slate-400">
              No feed posts yet. Be the first to publish from a mood room!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="feed" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
