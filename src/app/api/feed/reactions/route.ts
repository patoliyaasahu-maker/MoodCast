import { NextResponse } from "next/server";
import { z } from "zod";
import { ReactionType } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardCoinsForReaction } from "@/lib/coins";
import { COUNT_FIELD, pickReactionCounts } from "@/lib/reactions";

const schema = z.object({
  feedPostId: z.string(),
  type: z.nativeEnum(ReactionType),
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { feedPostId, type } = schema.parse(body);
    const reactionType = type as ReactionType;

    const feedPost = await prisma.feedPost.findUnique({ where: { id: feedPostId } });
    if (!feedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (feedPost.authorId === user.id) {
      return NextResponse.json({ error: "Cannot react to your own post" }, { status: 400 });
    }

    const existing = await prisma.feedReaction.findUnique({
      where: { feedPostId_userId_type: { feedPostId, userId: user.id, type: reactionType } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already reacted" }, { status: 400 });
    }

    const countField = COUNT_FIELD[reactionType];

    await prisma.$transaction([
      prisma.feedReaction.create({
        data: { feedPostId, userId: user.id, type: reactionType },
      }),
      prisma.feedPost.update({
        where: { id: feedPostId },
        data: { [countField]: { increment: 1 } },
      }),
    ]);

    await awardCoinsForReaction(feedPost.authorId, reactionType, feedPostId);

    const updated = await prisma.feedPost.findUnique({ where: { id: feedPostId } });

    return NextResponse.json({
      post: { id: updated!.id, ...pickReactionCounts(updated!) },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Reaction failed" }, { status: 500 });
  }
}
