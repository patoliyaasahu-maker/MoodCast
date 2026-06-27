import { NextResponse } from "next/server";
import { requireUser, getAnonymousName } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mood = searchParams.get("mood");

  const posts = await prisma.feedPost.findMany({
    where: mood ? { moodLabel: mood } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, displayName: true, anonymousAlias: true } },
      reactions: { where: { userId: user.id } },
    },
  });

  const moods = await prisma.feedPost.groupBy({
    by: ["moodLabel"],
    _count: { moodLabel: true },
    orderBy: { _count: { moodLabel: "desc" } },
  });

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      content: p.content,
      moodLabel: p.moodLabel,
      authorAlias: getAnonymousName(p.author),
      isOwn: p.author.id === user.id,
      likeCount: p.likeCount,
      helpfulCount: p.helpfulCount,
      saveCount: p.saveCount,
      shareCount: p.shareCount,
      createdAt: p.createdAt.toISOString(),
      myReactions: p.reactions.map((r) => r.type),
    })),
    moods: moods.map((m) => ({ label: m.moodLabel, count: m._count.moodLabel })),
  });
}
