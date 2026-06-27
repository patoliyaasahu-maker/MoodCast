import "dotenv/config";
import { seedDatabase } from "../src/lib/seed";
import { prisma } from "../src/lib/prisma";

async function connectWithRetry(maxAttempts = 5) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await prisma.$connect();
      return;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const wait = attempt * 2000;
      console.log(`Database waking up… retry ${attempt}/${maxAttempts} in ${wait / 1000}s`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

async function main() {
  await connectWithRetry();
  const result = await seedDatabase();
  console.log(`Seeded ${result.demoUsers} demo users (password: demo1234)`);
  console.log(`Feed: ${result.feedPostsCreated} new posts (${result.feedPostsTotal} total in catalog)`);
  console.log(`Rooms: ${result.roomsCreated} new rooms (${result.roomsTotal} total in catalog)`);
  console.log(`Room posts: ${result.roomPostsCreated} new · Members added: ${result.membersAdded}`);
  console.log("Login as: demo@moodcast.app / demo1234");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
