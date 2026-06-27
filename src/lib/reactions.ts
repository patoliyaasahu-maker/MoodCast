import { ReactionType } from "@prisma/client";

export const REACTION_DEFS = [
  { type: "LIKE" as const, emoji: "❤️", label: "Like", field: "likeCount" as const },
  { type: "HELPFUL" as const, emoji: "👍", label: "Helpful", field: "helpfulCount" as const },
  { type: "LAUGH" as const, emoji: "😂", label: "Laugh", field: "laughCount" as const },
  { type: "SUPPORT" as const, emoji: "🤗", label: "Support", field: "supportCount" as const },
  { type: "RELATE" as const, emoji: "💯", label: "Relate", field: "relateCount" as const },
  { type: "WOW" as const, emoji: "😮", label: "Wow", field: "wowCount" as const },
  { type: "SAVE" as const, emoji: "🔖", label: "Save", field: "saveCount" as const },
  { type: "SHARE" as const, emoji: "📤", label: "Share", field: "shareCount" as const },
] as const;

export type ReactionField = (typeof REACTION_DEFS)[number]["field"];

export const REACTION_TYPES = REACTION_DEFS.map((r) => r.type);

export const COUNT_FIELD: Record<ReactionType, ReactionField> = {
  LIKE: "likeCount",
  HELPFUL: "helpfulCount",
  SAVE: "saveCount",
  SHARE: "shareCount",
  LAUGH: "laughCount",
  SUPPORT: "supportCount",
  RELATE: "relateCount",
  WOW: "wowCount",
};

export type ReactionCounts = Record<ReactionField, number>;

export function pickReactionCounts(post: ReactionCounts) {
  return {
    likeCount: post.likeCount,
    helpfulCount: post.helpfulCount,
    saveCount: post.saveCount,
    shareCount: post.shareCount,
    laughCount: post.laughCount,
    supportCount: post.supportCount,
    relateCount: post.relateCount,
    wowCount: post.wowCount,
  };
}
