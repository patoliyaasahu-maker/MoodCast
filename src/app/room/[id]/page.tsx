import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { RoomView } from "@/components/RoomView";
import { requireUser, getAnonymousName } from "@/lib/auth";
import { expireStaleRooms } from "@/lib/rooms";
import { isDemoUser } from "@/lib/demo";
import { pickReactionCounts } from "@/lib/reactions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function RoomPage({ params }: Props) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const { id } = await params;
  await expireStaleRooms();

  const membership = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId: id, userId: user.id } },
  });

  if (!membership) notFound();

  const room = await prisma.room.findUnique({
    where: { id },
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
          _count: { select: { comments: true } },
        },
      },
      _count: { select: { members: true } },
    },
  });

  if (!room || room.expiresAt < new Date()) {
    return (
      <div className="min-h-screen">
        <Navbar user={{ displayName: user.displayName, moodCoins: user.moodCoins }} />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-white">Room expired</h1>
          <p className="mt-2 text-slate-400">This room has dissolved after 24 hours.</p>
          <a href="/dashboard" className="mt-6 inline-block text-violet-400 hover:underline">
            Back to dashboard
          </a>
        </main>
      </div>
    );
  }

  const roomData = {
    id: room.id,
    name: room.name,
    moodLabel: room.moodLabel,
    expiresAt: room.expiresAt.toISOString(),
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
      commentCount: p._count.comments,
      ...pickReactionCounts(p),
      createdAt: p.createdAt.toISOString(),
      myReactions: p.reactions.map((r) => r.type),
      publishedToFeed: !!p.feedPost,
      feedPostId: p.feedPost?.id ?? null,
    })),
  };

  return (
    <div className="min-h-screen">
      <Navbar user={{ displayName: user.displayName, moodCoins: user.moodCoins }} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <RoomView initialRoom={roomData} />
      </main>
    </div>
  );
}
