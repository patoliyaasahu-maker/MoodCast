import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, getAnonymousName } from "@/lib/auth";
import { isDemoUser } from "@/lib/demo";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  feedPostId: z.string(),
  content: z.string().min(1).max(500),
});

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feedPostId = new URL(request.url).searchParams.get("feedPostId");
  if (!feedPostId) {
    return NextResponse.json({ error: "feedPostId required" }, { status: 400 });
  }

  const comments = await prisma.feedComment.findMany({
    where: { feedPostId },
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
    const { feedPostId, content } = postSchema.parse(await request.json());

    const feedPost = await prisma.feedPost.findUnique({ where: { id: feedPostId } });
    if (!feedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await prisma.feedComment.create({
      data: { feedPostId, authorId: user.id, content },
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
