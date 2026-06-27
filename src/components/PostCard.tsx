"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { UserAlias } from "./UserAlias";

type Post = {
  id: string;
  content: string;
  authorAlias: string;
  isOwn: boolean;
  isDemo?: boolean;
  likeCount: number;
  helpfulCount: number;
  saveCount: number;
  shareCount: number;
  createdAt: string;
  myReactions: string[];
  publishedToFeed?: boolean;
  feedPostId?: string | null;
  moodLabel?: string;
};

const REACTIONS = [
  { type: "LIKE", emoji: "❤️", label: "Like", field: "likeCount" as const },
  { type: "HELPFUL", emoji: "👍", label: "Helpful", field: "helpfulCount" as const },
  { type: "SAVE", emoji: "🔖", label: "Save", field: "saveCount" as const },
  { type: "SHARE", emoji: "📤", label: "Share", field: "shareCount" as const },
];

type PostCardProps = {
  post: Post;
  variant?: "room" | "feed";
  onPublished?: (postId: string) => void;
};

export function PostCard({ post: initialPost, variant = "room", onPublished }: PostCardProps) {
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  async function react(type: string) {
    if (post.isOwn || post.myReactions.includes(type)) return;
    setLoading(type);

    const endpoint = variant === "feed" ? "/api/feed/reactions" : "/api/reactions";
    const body =
      variant === "feed"
        ? { feedPostId: post.id, type }
        : { postId: post.id, type };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(null);

    if (res.ok) {
      setPost((p) => ({
        ...p,
        likeCount: data.post.likeCount,
        helpfulCount: data.post.helpfulCount,
        saveCount: data.post.saveCount,
        shareCount: data.post.shareCount,
        myReactions: [...p.myReactions, type],
      }));
    }
  }

  async function publishToFeed() {
    if (post.publishedToFeed || publishing) return;
    setPublishing(true);

    const res = await fetch("/api/feed/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });

    setPublishing(false);

    if (res.ok) {
      setPost((p) => ({ ...p, publishedToFeed: true }));
      onPublished?.(post.id);
    }
  }

  return (
    <article className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <UserAlias alias={post.authorAlias} isDemo={post.isDemo} />
          {post.moodLabel && (
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">
              {post.moodLabel}
            </span>
          )}
          {post.publishedToFeed && variant === "room" && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-300">
              <Globe className="h-3 w-3" />
              On Feed
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs text-slate-500">
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>
      <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
        {post.content}
      </p>

      {post.isOwn && variant === "room" && !post.publishedToFeed && (
        <button
          onClick={publishToFeed}
          disabled={publishing}
          className="mb-3 flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 hover:bg-violet-500/20 disabled:opacity-50"
        >
          <Globe className="h-3.5 w-3.5" />
          {publishing ? "Publishing..." : "Publish to MoodCast Feed"}
        </button>
      )}

      {post.isOwn && variant === "room" && post.publishedToFeed && (
        <p className="mb-3 flex items-center gap-1 text-xs text-green-400">
          <Check className="h-3.5 w-3.5" />
          Published to feed — survives after room expires
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((r) => {
          const count = post[r.field];
          const active = post.myReactions.includes(r.type);
          return (
            <button
              key={r.type}
              onClick={() => react(r.type)}
              disabled={post.isOwn || active || loading === r.type}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition ${
                active
                  ? "border-violet-500 bg-violet-500/20 text-violet-200"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white disabled:opacity-40"
              }`}
              title={post.isOwn ? "Can't react to your own post" : r.label}
            >
              <span>{r.emoji}</span>
              <span>{count > 0 ? count : r.label}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
