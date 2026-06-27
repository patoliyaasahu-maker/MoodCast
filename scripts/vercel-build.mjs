#!/usr/bin/env node
import { execSync } from "node:child_process";
import { config } from "dotenv";

config();

const dbUrl = process.env.DATABASE_URL ?? "";

function run(cmd) {
  console.log(`\n▶ ${cmd}\n`);
  execSync(cmd, { stdio: "inherit" });
}

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!dbUrl) {
  fail(
    "Missing DATABASE_URL.\n" +
      "   Vercel → Settings → Environment Variables → add Neon connection string.\n" +
      "   Use pooled URL: ep-xxx-pooler.region.aws.neon.tech?sslmode=require"
  );
}

if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
  fail("DATABASE_URL points to localhost. Use your Neon URL on Vercel.");
}

run("npx prisma generate");
run("node scripts/neon-schema.mjs");
run("npx next build");

console.log("\n✅ Vercel build complete\n");
