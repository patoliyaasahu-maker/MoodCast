#!/usr/bin/env node
import { execSync } from "node:child_process";
import { config } from "dotenv";

// Load .env for local `vercel build` — on Vercel, env vars come from the dashboard
config();

const dbUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";

function run(cmd) {
  console.log(`\n▶ ${cmd}\n`);
  execSync(cmd, { stdio: "inherit" });
}

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!dbUrl || !directUrl) {
  fail(
    "Missing DATABASE_URL or DIRECT_URL.\n" +
      "   On Vercel → Settings → Environment Variables, add BOTH from Neon:\n" +
      "   • DATABASE_URL  = pooled connection (hostname has -pooler)\n" +
      "   • DIRECT_URL    = direct connection (no -pooler)\n" +
      "   https://neon.tech"
  );
}

if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
  fail(
    "DATABASE_URL points to localhost — Vercel cannot reach your local machine.\n" +
      "   Replace with your Neon PostgreSQL URLs in Vercel env vars.\n" +
      "   Do NOT copy values from your local .env file."
  );
}

if (directUrl.includes("localhost") || directUrl.includes("127.0.0.1")) {
  fail(
    "DIRECT_URL points to localhost — use Neon direct connection URL on Vercel."
  );
}

run("npx prisma generate");
run("npx prisma migrate deploy");
run("npx next build");

console.log("\n✅ Vercel build complete\n");
