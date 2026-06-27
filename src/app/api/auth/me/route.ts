import { NextResponse } from "next/server";
import { getSession, requireUser } from "@/lib/auth";
import { getActiveRoomForUser } from "@/lib/rooms";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const room = await getActiveRoomForUser(user.id);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayCheckIn = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.moodCheckIn.findFirst({
      where: { userId: user.id, createdAt: { gte: todayStart } },
      orderBy: { createdAt: "desc" },
    })
  );

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      city: user.city,
      moodCoins: user.moodCoins,
      isPremium: user.isPremium,
      anonymousAlias: user.anonymousAlias,
    },
    room: room
      ? {
          id: room.id,
          name: room.name,
          moodLabel: room.moodLabel,
          expiresAt: room.expiresAt,
          memberCount: room._count.members,
          postCount: room._count.posts,
        }
      : null,
    todayCheckIn: todayCheckIn
      ? {
          id: todayCheckIn.id,
          text: todayCheckIn.text,
          moodLabel: todayCheckIn.moodLabel,
          createdAt: todayCheckIn.createdAt,
        }
      : null,
  });
}
