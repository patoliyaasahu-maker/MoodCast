#!/usr/bin/env node
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("\n❌ DATABASE_URL missing in .env\n");
  process.exit(1);
}

console.log("\n🔌 MoodCast database setup\n");

execSync("node scripts/neon-schema.mjs", { stdio: "inherit" });

console.log("\n🌱 Seeding demo data...\n");
execSync("tsx prisma/seed.ts", { stdio: "inherit" });

console.log("\n✅ Setup complete! Login: demo@moodcast.app / demo1234\n");
