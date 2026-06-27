import { prisma } from "./prisma";
import { analyzeMood, generateRoomName } from "./mood-engine";

const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ROOM_SIZE = 12;

export async function expireStaleRooms() {
  const now = new Date();
  await prisma.room.deleteMany({
    where: { expiresAt: { lt: now } },
  });
}

export async function leaveActiveRooms(userId: string) {
  await expireStaleRooms();
  const now = new Date();
  await prisma.roomMember.deleteMany({
    where: {
      userId,
      room: { expiresAt: { gt: now } },
    },
  });
}

export async function matchUserToRoom(userId: string, moodLabel: string) {
  await expireStaleRooms();

  const now = new Date();
  let room = await prisma.room.findFirst({
    where: {
      moodLabel,
      expiresAt: { gt: now },
    },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: "asc" },
  });

  if (room && room._count.members >= MAX_ROOM_SIZE) {
    room = null;
  }

  if (!room) {
    room = await prisma.room.create({
      data: {
        name: generateRoomName(moodLabel),
        moodLabel,
        maxMembers: MAX_ROOM_SIZE,
        expiresAt: new Date(Date.now() + ROOM_TTL_MS),
      },
      include: { _count: { select: { members: true } } },
    });
  }

  const existing = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId: room.id, userId } },
  });

  if (!existing) {
    const count = await prisma.roomMember.count({ where: { roomId: room.id } });
    if (count >= MAX_ROOM_SIZE) {
      room = await prisma.room.create({
        data: {
          name: generateRoomName(moodLabel),
          moodLabel,
          maxMembers: MAX_ROOM_SIZE,
          expiresAt: new Date(Date.now() + ROOM_TTL_MS),
        },
        include: { _count: { select: { members: true } } },
      });
    }
    await prisma.roomMember.create({
      data: { roomId: room.id, userId },
    });
  }

  return prisma.room.findUniqueOrThrow({
    where: { id: room.id },
    include: {
      members: {
        include: { user: { select: { id: true, displayName: true, anonymousAlias: true } } },
      },
      _count: { select: { members: true, posts: true } },
    },
  });
}

export async function processCheckIn(
  userId: string,
  text: string,
  options?: { changeMood?: boolean }
) {
  if (options?.changeMood) {
    await leaveActiveRooms(userId);
  }

  const analysis = analyzeMood(text);

  const checkIn = await prisma.moodCheckIn.create({
    data: {
      userId,
      text,
      moodLabel: analysis.label,
      moodScore: analysis.score,
    },
  });

  const room = await matchUserToRoom(userId, analysis.label);
  return { checkIn, analysis, room, moodChanged: !!options?.changeMood };
}

export async function getActiveRoomForUser(userId: string) {
  await expireStaleRooms();
  const now = new Date();

  const membership = await prisma.roomMember.findFirst({
    where: {
      userId,
      room: { expiresAt: { gt: now } },
    },
    include: {
      room: {
        include: {
          members: {
            include: { user: { select: { id: true, displayName: true, anonymousAlias: true } } },
          },
          _count: { select: { members: true, posts: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return membership?.room ?? null;
}
