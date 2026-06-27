#!/usr/bin/env node
/**
 * Sets up Neon via HTTPS/WebSocket (works when port 5432 is blocked locally).
 * Prisma CLI migrate uses TCP :5432 which fails on many networks.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { config } from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

config({ path: resolve(process.cwd(), ".env") });

neonConfig.webSocketConstructor = ws;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("\n❌ DATABASE_URL missing in .env\n");
  process.exit(1);
}

const SKIP_CODES = new Set([
  "42P06", // schema exists
  "42710", // type exists
  "42P07", // table exists
  "42701", // column exists
  "42P16", // index exists
  "42704", // constraint missing (skip drops)
]);

function parseStatements(sql) {
  return sql
    .split(/;\s*\n/)
    .map((s) =>
      s
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim()
    )
    .filter(Boolean);
}

async function main() {
  console.log("\n🔌 Connecting to Neon (WebSocket — no port 5432 needed)...\n");

  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("✅ Connected to Neon\n");

    const migrationPath = resolve(
      process.cwd(),
      "prisma/migrations/20250627000000_init/migration.sql"
    );
    const migrationSql = readFileSync(migrationPath, "utf8");
    const statements = parseStatements(migrationSql);

    console.log(`📦 Running ${statements.length} schema statements...\n`);

    for (const statement of statements) {
      const preview = statement.slice(0, 60).replace(/\s+/g, " ");
      try {
        await client.query(statement);
        console.log(`  ✓ ${preview}...`);
      } catch (err) {
        if (err && typeof err === "object" && "code" in err && SKIP_CODES.has(err.code)) {
          console.log(`  · skipped (already exists): ${preview}...`);
        } else {
          throw err;
        }
      }
    }

    console.log("\n🌱 Seeding demo data...\n");
  } finally {
    client.release();
    await pool.end();
  }

  execSync("tsx prisma/seed.ts", { stdio: "inherit" });

  console.log("\n✅ Database setup complete!");
  console.log("   Demo login: demo@moodcast.app / demo1234");
  console.log("   Start app:  npm run dev\n");
}

main().catch((err) => {
  console.error("\n❌ Setup failed:\n", err.message ?? err);
  console.error("\nTips:");
  console.error("  1. Check Neon project is Active at console.neon.tech");
  console.error("  2. Copy fresh connection string into .env DATABASE_URL");
  console.error("  3. Restart Neon compute if suspended\n");
  process.exit(1);
});
