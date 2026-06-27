import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const FEED_POSTS = [
  {
    email: "rahul@demo.com",
    moodLabel: "Stressed",
    content:
      "Today my manager criticized me in front of everyone. I smiled and nodded but inside I wanted to disappear. Anyone else feel like they're performing okay-ness at work?",
    likes: 12,
    helpful: 8,
    saves: 3,
    shares: 2,
  },
  {
    email: "priya@demo.com",
    moodLabel: "Anxious",
    content:
      "3 AM again. My brain is running scenarios that will never happen. I know logically I'm fine. My body doesn't believe me.",
    likes: 24,
    helpful: 15,
    saves: 6,
    shares: 4,
  },
  {
    email: "amit@demo.com",
    moodLabel: "Sad",
    content:
      "Moved to a new city for work. I have colleagues but no one who'd notice if I didn't show up to lunch. Loneliness in a crowd is a strange feeling.",
    likes: 18,
    helpful: 11,
    saves: 5,
    shares: 1,
  },
  {
    email: "sneha@demo.com",
    moodLabel: "Hopeful",
    content:
      "Small win today: I told my friend I wasn't okay instead of saying 'I'm fine.' She just listened. No advice. That was enough.",
    likes: 31,
    helpful: 22,
    saves: 9,
    shares: 7,
  },
  {
    email: "priya@demo.com",
    moodLabel: "Tired",
    content:
      "Burnout isn't always dramatic. Sometimes it's answering 'how are you' with 'tired' for six months straight and meaning it every time.",
    likes: 27,
    helpful: 19,
    saves: 8,
    shares: 3,
  },
];

export async function seedDatabase() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const userData = [
    { email: "rahul@demo.com", displayName: "Rahul", anonymousAlias: "QuietWave", city: "Pune" },
    { email: "priya@demo.com", displayName: "Priya", anonymousAlias: "MoonLeaf", city: "Mumbai" },
    { email: "amit@demo.com", displayName: "Amit", anonymousAlias: "SoftEcho", city: "Bangalore" },
    { email: "sneha@demo.com", displayName: "Sneha", anonymousAlias: "CalmRiver", city: "Delhi" },
    { email: "demo@moodcast.app", displayName: "Demo User", anonymousAlias: "StarGazer", city: "Pune" },
  ];

  const users = await Promise.all(
    userData.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, passwordHash, moodCoins: 50 },
      })
    )
  );

  const userByEmail = Object.fromEntries(users.map((u) => [u.email, u]));
  let feedPostsCreated = 0;

  for (const post of FEED_POSTS) {
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
        },
      });
      feedPostsCreated++;
    }
  }

  return {
    users: users.length,
    feedPostsCreated,
    demoLogin: { email: "demo@moodcast.app", password: "demo1234" },
  };
}
