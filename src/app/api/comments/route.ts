import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, getAnonymousName } from "@/lib/auth";
import { isDemoUser } from "@/lib/demo";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(500),
});

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = new URL(request.url).searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  const comments = await prisma.postComment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    take: 50,
    include: {
      author: { select: { id: true, email: true, displayName: true, anonymousAlias: true } },
    },
  });

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c.id,
      content: c.content,
      authorAlias: getAnonymousName(c.author),
      isOwn: c.author.id === user.id,
      isDemo: isDemoUser(c.author.email),
      createdAt: c.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId, content } = postSchema.parse(await request.json());

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

    const membership = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId: post.roomId, userId: user.id } },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a room member" }, { status: 403 });
    }

    const comment = await prisma.postComment.create({
      data: { postId, authorId: user.id, content },
      include: {
        author: { select: { id: true, email: true, displayName: true, anonymousAlias: true } },
      },
    });

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content,
        authorAlias: getAnonymousName(comment.author),
        isOwn: true,
        isDemo: isDemoUser(comment.author.email),
        createdAt: comment.createdAt.toISOString(),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Comment failed" }, { status: 500 });
  }
}
