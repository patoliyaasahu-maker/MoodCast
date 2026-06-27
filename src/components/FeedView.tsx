"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LayoutGrid } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";

type FeedPost = Parameters<typeof PostCard>[0]["post"];
type MoodFilter = { label: string; count: number };
type FeedView = "forYou" | "all";

export function FeedView() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [moods, setMoods] = useState<MoodFilter[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [feedView, setFeedView] = useState<FeedView>("forYou");
  const [user, setUser] = useState<{ displayName: string; moodCoins: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function loadFeed(view: FeedView, mood: string | null) {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("view", view);
    if (mood) params.set("mood", mood);
    const res = await fetch(`/api/feed?${params}`);
    const data = await res.json();
    setPosts(data.posts);
    setMoods(data.moods);
    setInterests(data.interests ?? []);
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (!me.user) {
        router.push("/login");
        return;
      }
      setUser({ displayName: me.user.displayName, moodCoins: me.user.moodCoins });
      await loadFeed("forYou", null);
    }
    init();
  }, [router]);

  async function switchView(view: FeedView) {
    setFeedView(view);
    setActiveMood(null);
    await loadFeed(view, null);
  }

  async function filterByMood(mood: string | null) {
    setActiveMood(mood);
    await loadFeed(feedView, mood);
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
            {feedView === "forYou"
              ? "Personalized for your moods and interests"
              : "All posts from the community"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => switchView("forYou")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition",
              feedView === "forYou"
                ? "bg-violet-600 text-white"
                : "border border-white/10 text-slate-400 hover:text-white"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            For You
          </button>
          <button
            onClick={() => switchView("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition",
              feedView === "all"
                ? "bg-violet-600 text-white"
                : "border border-white/10 text-slate-400 hover:text-white"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            All Posts
          </button>
        </div>

        {feedView === "forYou" && interests.length > 0 && !activeMood && (
          <Card>
            <p className="text-xs text-slate-400">
              Based on your check-ins & activity:{" "}
              {interests.map((i) => (
                <span key={i} className="mr-1.5 rounded-full bg-violet-500/20 px-2 py-0.5 text-violet-300">
                  {i}
                </span>
              ))}
            </p>
          </Card>
        )}

        {moods.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => filterByMood(null)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition",
                !activeMood
                  ? "bg-violet-600/80 text-white"
                  : "border border-white/10 text-slate-400 hover:text-white"
              )}
            >
              {feedView === "forYou" ? "All interests" : "All moods"}
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
            React with emojis, leave comments, and publish from your room to share on the feed.
          </p>
        </Card>

        {loading ? (
          <p className="text-center text-slate-400">Loading feed...</p>
        ) : posts.length === 0 ? (
          <Card>
            <p className="text-center text-slate-400">
              {feedView === "forYou"
                ? "No matching posts yet. Try All Posts or check in with how you feel!"
                : "No feed posts yet. Be the first to publish from a mood room!"}
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
