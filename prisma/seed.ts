import { seedDatabase } from "../src/lib/seed";
import { prisma } from "../src/lib/prisma";

async function main() {
  const result = await seedDatabase();
  console.log(`Seeded ${result.users} demo users (password: demo1234)`);
  console.log(`Created ${result.feedPostsCreated} feed posts`);
  console.log("Login as: demo@moodcast.app / demo1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
