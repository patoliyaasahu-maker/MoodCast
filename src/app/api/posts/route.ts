import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expireStaleRooms } from "@/lib/rooms";
import { publishPostToFeed } from "@/lib/feed";

const schema = z.object({
  roomId: z.string(),
  content: z.string().min(1).max(2000),
  publishToFeed: z.boolean().optional(),
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await expireStaleRooms();

  try {
    const body = await request.json();
    const { roomId, content, publishToFeed } = schema.parse(body);

    const membership = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: user.id } },
      include: { room: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this room" }, { status: 403 });
    }

    if (membership.room.expiresAt < new Date()) {
      return NextResponse.json({ error: "Room has expired" }, { status: 410 });
    }

    const post = await prisma.post.create({
      data: { roomId, authorId: user.id, content },
    });

    let feedPostId: string | null = null;
    if (publishToFeed) {
      const feedPost = await publishPostToFeed(post.id, user.id);
      feedPostId = feedPost.id;
    }

    return NextResponse.json({
      post: {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        publishedToFeed: !!feedPostId,
        feedPostId,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
