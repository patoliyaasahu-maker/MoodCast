import { prisma } from "./prisma";

export async function publishPostToFeed(postId: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { room: true, feedPost: true },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== userId) {
    throw new Error("Only the author can publish to feed");
  }

  if (post.feedPost) {
    return post.feedPost;
  }

  if (post.room.expiresAt < new Date()) {
    throw new Error("Room has expired");
  }

  return prisma.feedPost.create({
    data: {
      authorId: userId,
      content: post.content,
      moodLabel: post.room.moodLabel,
      sourcePostId: post.id,
    },
  });
}
