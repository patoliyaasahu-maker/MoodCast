import { NextResponse } from "next/server";
import { requireUser, getAnonymousName } from "@/lib/auth";
import { isDemoUser } from "@/lib/demo";
import { getUserInterests, sortByInterests, topInterests } from "@/lib/interests";
import { pickReactionCounts } from "@/lib/reactions";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mood = searchParams.get("mood");
  const view = searchParams.get("view") ?? "forYou";

  const interests = await getUserInterests(user.id);
  const interestLabels = topInterests(interests);

  const posts = await prisma.feedPost.findMany({
    where: mood ? { moodLabel: mood } : undefined,
    orderBy: { createdAt: "desc" },
    take: 80,
    include: {
      author: { select: { id: true, email: true, displayName: true, anonymousAlias: true } },
      reactions: { where: { userId: user.id } },
      _count: { select: { comments: true } },
    },
  });

  const sorted =
    view === "all" || mood
      ? posts
      : sortByInterests(posts, interests).slice(0, 50);

  const moods = await prisma.feedPost.groupBy({
    by: ["moodLabel"],
    _count: { moodLabel: true },
    orderBy: { _count: { moodLabel: "desc" } },
  });

  return NextResponse.json({
    view,
    interests: interestLabels,
    posts: sorted.map((p) => ({
      id: p.id,
      content: p.content,
      moodLabel: p.moodLabel,
      authorAlias: getAnonymousName(p.author),
      isOwn: p.author.id === user.id,
      isDemo: isDemoUser(p.author.email),
      commentCount: p._count.comments,
      ...pickReactionCounts(p),
      createdAt: p.createdAt.toISOString(),
      myReactions: p.reactions.map((r) => r.type),
    })),
    moods: moods.map((m) => ({ label: m.moodLabel, count: m._count.moodLabel })),
  });
}
