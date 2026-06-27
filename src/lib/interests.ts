import { prisma } from "./prisma";

export type InterestMap = Map<string, number>;

export async function getUserInterests(userId: string): Promise<InterestMap> {
  const scores = new Map<string, number>();

  const [checkIns, reactions, comments] = await Promise.all([
    prisma.moodCheckIn.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: { moodLabel: true },
    }),
    prisma.feedReaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 25,
      include: { feedPost: { select: { moodLabel: true } } },
    }),
    prisma.feedComment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { feedPost: { select: { moodLabel: true } } },
    }),
  ]);

  for (const checkIn of checkIns) {
    scores.set(checkIn.moodLabel, (scores.get(checkIn.moodLabel) ?? 0) + 3);
  }
  for (const reaction of reactions) {
    const label = reaction.feedPost.moodLabel;
    scores.set(label, (scores.get(label) ?? 0) + 2);
  }
  for (const comment of comments) {
    const label = comment.feedPost.moodLabel;
    scores.set(label, (scores.get(label) ?? 0) + 1);
  }

  return scores;
}

export function sortByInterests<T extends { moodLabel: string; createdAt: Date }>(
  posts: T[],
  interests: InterestMap
): T[] {
  if (interests.size === 0) {
    return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return [...posts].sort((a, b) => {
    const scoreA = interests.get(a.moodLabel) ?? 0;
    const scoreB = interests.get(b.moodLabel) ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export function topInterests(interests: InterestMap, limit = 5): string[] {
  return [...interests.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
}
