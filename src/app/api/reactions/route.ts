import { NextResponse } from "next/server";
import { z } from "zod";
import { ReactionType } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardCoinsForReaction } from "@/lib/coins";
import { COUNT_FIELD, pickReactionCounts } from "@/lib/reactions";

const schema = z.object({
  postId: z.string(),
  type: z.nativeEnum(ReactionType),
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { postId, type } = schema.parse(body);
    const reactionType = type as ReactionType;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { room: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.room.expiresAt < new Date()) {
      return NextResponse.json({ error: "Room has expired" }, { status: 410 });
    }

    if (post.authorId === user.id) {
      return NextResponse.json({ error: "Cannot react to your own post" }, { status: 400 });
    }

    const existing = await prisma.reaction.findUnique({
      where: { postId_userId_type: { postId, userId: user.id, type: reactionType } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already reacted" }, { status: 400 });
    }

    const countField = COUNT_FIELD[reactionType];

    await prisma.$transaction([
      prisma.reaction.create({
        data: { postId, userId: user.id, type: reactionType },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { [countField]: { increment: 1 } },
      }),
    ]);

    await awardCoinsForReaction(post.authorId, reactionType, postId);

    const updated = await prisma.post.findUnique({ where: { id: postId } });

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
