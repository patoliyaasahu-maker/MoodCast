"use client";

import { useState } from "react";
import { Globe, Check, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { REACTION_DEFS } from "@/lib/reactions";
import { UserAlias } from "./UserAlias";

export type Comment = {
  id: string;
  content: string;
  authorAlias: string;
  isOwn: boolean;
  isDemo?: boolean;
  createdAt: string;
};

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
  laughCount?: number;
  supportCount?: number;
  relateCount?: number;
  wowCount?: number;
  commentCount?: number;
  createdAt: string;
  myReactions: string[];
  publishedToFeed?: boolean;
  feedPostId?: string | null;
  moodLabel?: string;
};

type PostCardProps = {
  post: Post;
  variant?: "room" | "feed";
  onPublished?: (postId: string) => void;
};

function reactionCount(post: Post, field: (typeof REACTION_DEFS)[number]["field"]) {
  return post[field] ?? 0;
}

export function PostCard({ post: initialPost, variant = "room", onPublished }: PostCardProps) {
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

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
        ...data.post,
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

  async function loadComments() {
    const param = variant === "feed" ? `feedPostId=${post.id}` : `postId=${post.id}`;
    const endpoint = variant === "feed" ? "/api/feed/comments" : "/api/comments";
    const res = await fetch(`${endpoint}?${param}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
      setCommentsLoaded(true);
    }
  }

  async function toggleComments() {
    if (!showComments && !commentsLoaded) {
      await loadComments();
    }
    setShowComments((v) => !v);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);

    const endpoint = variant === "feed" ? "/api/feed/comments" : "/api/comments";
    const body =
      variant === "feed"
        ? { feedPostId: post.id, content: commentText.trim() }
        : { postId: post.id, content: commentText.trim() };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setCommentLoading(false);

    if (res.ok) {
      setComments((c) => [...c, data.comment]);
      setPost((p) => ({ ...p, commentCount: (p.commentCount ?? 0) + 1 }));
      setCommentText("");
      setShowComments(true);
    }
  }

  const totalComments = post.commentCount ?? comments.length;

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

      <div className="flex flex-wrap gap-1.5">
        {REACTION_DEFS.map((r) => {
          const count = reactionCount(post, r.field);
          const active = post.myReactions.includes(r.type);
          return (
            <button
              key={r.type}
              onClick={() => react(r.type)}
              disabled={post.isOwn || active || loading === r.type}
              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition ${
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

      <div className="mt-3 border-t border-white/5 pt-3">
        <button
          type="button"
          onClick={toggleComments}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-violet-300"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {totalComments > 0 ? `${totalComments} comment${totalComments === 1 ? "" : "s"}` : "Add a comment"}
          {showComments ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showComments && (
          <div className="mt-3 space-y-3">
            {comments.length === 0 && commentsLoaded && (
              <p className="text-xs text-slate-500">No comments yet. Start the conversation.</p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg bg-white/5 px-3 py-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <UserAlias alias={c.authorAlias} isDemo={c.isDemo} isYou={c.isOwn} size="sm" />
                  <span className="text-[10px] text-slate-500">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">{c.content}</p>
              </div>
            ))}
            <form onSubmit={submitComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                maxLength={500}
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={commentLoading || !commentText.trim()}
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
              >
                {commentLoading ? "..." : "Post"}
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
