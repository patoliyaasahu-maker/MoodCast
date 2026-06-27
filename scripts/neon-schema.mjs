#!/usr/bin/env node
/**
 * Apply DB schema via Neon WebSocket (no TCP port 5432).
 * Used locally (db:setup) and on Vercel build.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

config({ path: resolve(process.cwd(), ".env") });

neonConfig.webSocketConstructor = ws;

const SKIP_CODES = new Set(["42P06", "42710", "42P07", "42701", "42P16", "42704"]);

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

export async function applyNeonSchema(connectionString) {
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");

    const migrationPath = resolve(
      process.cwd(),
      "prisma/migrations/20250627000000_init/migration.sql"
    );
    const statements = parseStatements(readFileSync(migrationPath, "utf8"));

    for (const statement of statements) {
      const preview = statement.slice(0, 60).replace(/\s+/g, " ");
      try {
        await client.query(statement);
        console.log(`  ✓ ${preview}...`);
      } catch (err) {
        if (err && typeof err === "object" && "code" in err && SKIP_CODES.has(err.code)) {
          console.log(`  · skipped: ${preview}...`);
        } else {
          throw err;
        }
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("\n❌ DATABASE_URL missing\n");
    process.exit(1);
  }

  console.log("\n🔌 Applying schema via Neon WebSocket...\n");
  await applyNeonSchema(url);
  console.log("\n✅ Schema ready\n");
}

const isDirectRun = process.argv[1]?.endsWith("neon-schema.mjs");
if (isDirectRun) {
  main().catch((err) => {
    console.error("\n❌ Schema setup failed:", err.message ?? err, "\n");
    process.exit(1);
  });
}
