import { NextResponse } from "next/server";
import { requireUser, getAnonymousName } from "@/lib/auth";
import { expireStaleRooms } from "@/lib/rooms";
import { prisma } from "@/lib/prisma";
import { isDemoUser } from "@/lib/demo";

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await expireStaleRooms();

  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("id");

  if (!roomId) {
    return NextResponse.json({ error: "Room ID required" }, { status: 400 });
  }

  const membership = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId: user.id } },
  });

  if (!membership) {
    return NextResponse.json({ error: "Not a member of this room" }, { status: 403 });
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      members: {
        include: { user: { select: { id: true, email: true, displayName: true, anonymousAlias: true } } },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, email: true, displayName: true, anonymousAlias: true } },
          reactions: { where: { userId: user.id } },
          feedPost: { select: { id: true } },
        },
      },
      _count: { select: { members: true } },
    },
  });

  if (!room || room.expiresAt < new Date()) {
    return NextResponse.json({ error: "Room has expired" }, { status: 410 });
  }

  return NextResponse.json({
    room: {
      id: room.id,
      name: room.name,
      moodLabel: room.moodLabel,
      expiresAt: room.expiresAt,
      memberCount: room._count.members,
      maxMembers: room.maxMembers,
      members: room.members.map((m) => ({
        id: m.user.id,
        alias: getAnonymousName(m.user),
        isYou: m.user.id === user.id,
        isDemo: isDemoUser(m.user.email),
      })),
      posts: room.posts.map((p) => ({
        id: p.id,
        content: p.content,
        authorAlias: getAnonymousName(p.author),
        isOwn: p.author.id === user.id,
        isDemo: isDemoUser(p.author.email),
        likeCount: p.likeCount,
        helpfulCount: p.helpfulCount,
        saveCount: p.saveCount,
        shareCount: p.shareCount,
        createdAt: p.createdAt,
        myReactions: p.reactions.map((r) => r.type),
        publishedToFeed: !!p.feedPost,
        feedPostId: p.feedPost?.id ?? null,
      })),
    },
  });
}
