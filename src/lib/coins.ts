import { CoinReason, ReactionType } from "@prisma/client";
import { prisma } from "./prisma";

export const COIN_VALUES: Record<ReactionType, number> = {
  LIKE: 1,
  HELPFUL: 5,
  SAVE: 3,
  SHARE: 5,
};

const REASON_MAP: Record<ReactionType, CoinReason> = {
  LIKE: "LIKE_RECEIVED",
  HELPFUL: "HELPFUL_RECEIVED",
  SAVE: "SAVE_RECEIVED",
  SHARE: "SHARE_RECEIVED",
};

export async function awardCoinsForReaction(
  postAuthorId: string,
  reactionType: ReactionType,
  postId: string
) {
  const amount = COIN_VALUES[reactionType];
  await prisma.$transaction([
    prisma.user.update({
      where: { id: postAuthorId },
      data: { moodCoins: { increment: amount } },
    }),
    prisma.coinTransaction.create({
      data: {
        userId: postAuthorId,
        amount,
        reason: REASON_MAP[reactionType],
        metadata: JSON.stringify({ postId, reactionType }),
      },
    }),
  ]);
}

export const REDEEM_OPTIONS = [
  { id: "premium", label: "Premium (1 month)", cost: 990, description: "Unlock unlimited rooms & insights" },
  { id: "gift50", label: "₹50 Gift Card", cost: 500, description: "Demo redemption — no real payout" },
  { id: "gift100", label: "₹100 Gift Card", cost: 1000, description: "Demo redemption — no real payout" },
] as const;
