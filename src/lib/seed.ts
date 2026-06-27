import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { isDemoUser } from "./demo";
import { DEMO_FEED_POSTS, DEMO_ROOMS, DEMO_USERS, DEMO_FEED_COMMENTS } from "./demo-content";

function hoursAgoDate(hours = 0) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

export async function seedDatabase() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const users = await Promise.all(
    DEMO_USERS.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {
          displayName: u.displayName,
          anonymousAlias: u.anonymousAlias,
          city: u.city,
          moodCoins: u.moodCoins,
        },
        create: { ...u, passwordHash },
      })
    )
  );

  const userByEmail = Object.fromEntries(users.map((u) => [u.email, u]));
  let feedPostsCreated = 0;
  let roomsCreated = 0;
  let roomPostsCreated = 0;
  let checkInsCreated = 0;
  let membersAdded = 0;
  let feedCommentsCreated = 0;

  for (const post of DEMO_FEED_POSTS) {
    const author = userByEmail[post.email];
    const existing = await prisma.feedPost.findFirst({
      where: { authorId: author.id, content: post.content },
    });
    if (!existing) {
      await prisma.feedPost.create({
        data: {
          authorId: author.id,
          content: post.content,
          moodLabel: post.moodLabel,
          likeCount: post.likes,
          helpfulCount: post.helpful,
          saveCount: post.saves,
          shareCount: post.shares,
          createdAt: hoursAgoDate(post.hoursAgo ?? 0),
        },
      });
      feedPostsCreated++;
    }
  }

  const expiresAt = new Date(Date.now() + 23 * 60 * 60 * 1000);

  for (const roomData of DEMO_ROOMS) {
    let room = await prisma.room.findFirst({
      where: { name: roomData.name, expiresAt: { gt: new Date() } },
    });

    if (!room) {
      room = await prisma.room.create({
        data: {
          name: roomData.name,
          moodLabel: roomData.moodLabel,
          expiresAt,
        },
      });
      roomsCreated++;
    }

    for (const email of roomData.memberEmails) {
      const user = userByEmail[email];
      const existingMember = await prisma.roomMember.findUnique({
        where: { roomId_userId: { roomId: room.id, userId: user.id } },
      });
      if (!existingMember) {
        await prisma.roomMember.create({
          data: { roomId: room.id, userId: user.id },
        });
        membersAdded++;
      }

      const checkInExists = await prisma.moodCheckIn.findFirst({
        where: { userId: user.id, moodLabel: roomData.moodLabel },
        orderBy: { createdAt: "desc" },
      });
      if (!checkInExists) {
        await prisma.moodCheckIn.create({
          data: {
            userId: user.id,
            text: `Feeling ${roomData.moodLabel.toLowerCase()} today.`,
            moodLabel: roomData.moodLabel,
            moodScore: 0.72,
            createdAt: hoursAgoDate(12),
          },
        });
        checkInsCreated++;
      }
    }

    for (const post of roomData.posts) {
      const author = userByEmail[post.email];
      const existing = await prisma.post.findFirst({
        where: { roomId: room.id, authorId: author.id, content: post.content },
      });
      if (!existing) {
        await prisma.post.create({
          data: {
            roomId: room.id,
            authorId: author.id,
            content: post.content,
            likeCount: post.likes ?? 0,
            helpfulCount: post.helpful ?? 0,
            saveCount: post.saves ?? 0,
            shareCount: post.shares ?? 0,
            createdAt: hoursAgoDate(post.hoursAgo ?? 0),
          },
        });
        roomPostsCreated++;
      }
    }
  }

  for (const item of DEMO_FEED_COMMENTS) {
    const author = userByEmail[item.authorEmail];
    const feedPost = await prisma.feedPost.findFirst({
      where: {
        authorId: userByEmail[item.postEmail].id,
        content: { contains: item.postMatch },
      },
    });
    if (!feedPost) continue;

    const existing = await prisma.feedComment.findFirst({
      where: { feedPostId: feedPost.id, authorId: author.id, content: item.content },
    });
    if (!existing) {
      await prisma.feedComment.create({
        data: {
          feedPostId: feedPost.id,
          authorId: author.id,
          content: item.content,
          createdAt: hoursAgoDate(1),
        },
      });
      feedCommentsCreated++;
    }
  }

  return {
    users: users.length,
    demoUsers: users.filter((u) => isDemoUser(u.email)).length,
    feedPostsCreated,
    feedPostsTotal: DEMO_FEED_POSTS.length,
    roomsCreated,
    roomsTotal: DEMO_ROOMS.length,
    roomPostsCreated,
    membersAdded,
    checkInsCreated,
    feedCommentsCreated,
    demoLogin: { email: "demo@moodcast.app", password: "demo1234" },
  };
}
