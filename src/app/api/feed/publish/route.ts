import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { publishPostToFeed } from "@/lib/feed";

const schema = z.object({
  postId: z.string(),
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { postId } = schema.parse(body);

    const feedPost = await publishPostToFeed(postId, user.id);

    return NextResponse.json({
      success: true,
      feedPost: {
        id: feedPost.id,
        moodLabel: feedPost.moodLabel,
        createdAt: feedPost.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Publish failed";
    const status = message.includes("not found") ? 404 : message.includes("author") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
