"use client";

import { useState } from "react";
import { Globe, RefreshCw } from "lucide-react";
import { PostCard } from "./PostCard";
import { Card } from "./Card";
import { ChangeMoodSection } from "./ChangeMoodSection";
import { UserAlias } from "./UserAlias";
import { formatTimeRemaining } from "@/lib/utils";

type RoomData = {
  id: string;
  name: string;
  moodLabel: string;
  expiresAt: string;
  memberCount: number;
  maxMembers: number;
  members: { id: string; alias: string; isYou: boolean; isDemo?: boolean }[];
  posts: Parameters<typeof PostCard>[0]["post"][];
};

export function RoomView({ initialRoom }: { initialRoom: RoomData }) {
  const [room, setRoom] = useState(initialRoom);
  const [content, setContent] = useState("");
  const [publishToFeed, setPublishToFeed] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function refreshRoom() {
    const res = await fetch(`/api/room?id=${room.id}`);
    if (res.ok) {
      const data = await res.json();
      setRoom(data.room);
    }
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: room.id, content, publishToFeed }),
    });

    const data = await res.json();
    setPosting(false);

    if (!res.ok) {
      setError(data.error || "Failed to post");
      return;
    }

    setContent("");
    setPublishToFeed(false);
    await refreshRoom();
  }

  function handlePublished(postId: string) {
    setRoom((r) => ({
      ...r,
      posts: r.posts.map((p) =>
        p.id === postId ? { ...p, publishedToFeed: true } : p
      ),
    }));
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-violet-400">{room.moodLabel}</p>
            <h1 className="text-2xl font-semibold text-white">{room.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {room.memberCount}/{room.maxMembers} people · {formatTimeRemaining(room.expiresAt)}
            </p>
          </div>
          <button
            onClick={refreshRoom}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
          >
            Refresh
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {room.members.map((m) => (
            <span
              key={m.id}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${
                m.isYou
                  ? "bg-violet-500/30 text-violet-200"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              <UserAlias alias={m.alias} isDemo={m.isDemo} isYou={m.isYou} />
            </span>
          ))}
        </div>
      </Card>

      <Card title="Share a thought">
        <form onSubmit={handlePost} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? No comments — reactions only."
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            required
          />
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:border-violet-500/30">
            <input
              type="checkbox"
              checked={publishToFeed}
              onChange={(e) => setPublishToFeed(e.target.checked)}
              className="h-4 w-4 rounded accent-violet-500"
            />
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-violet-400" />
              <div>
                <p className="text-sm text-white">Also publish to MoodCast Feed</p>
                <p className="text-xs text-slate-500">
                  High-value posts live on the public feed after your room expires
                </p>
              </div>
            </div>
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={posting || !content.trim()}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {posting ? "Posting..." : publishToFeed ? "Post & publish to feed" : "Post to room"}
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Room posts ({room.posts.length})
        </h2>
        {room.posts.length === 0 ? (
          <p className="text-sm text-slate-500">No posts yet. Be the first to share.</p>
        ) : (
          room.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              variant="room"
              onPublished={handlePublished}
            />
          ))
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <RefreshCw className="h-4 w-4 text-amber-400" />
          <span>Not feeling {room.moodLabel.toLowerCase()} anymore?</span>
        </div>
        <ChangeMoodSection
          currentMoodLabel={room.moodLabel}
          currentRoomName={room.name}
        />
      </div>
    </div>
  );
}
