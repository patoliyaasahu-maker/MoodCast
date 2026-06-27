# MoodCast MVP

**Share how you feel. Not how you look.**

Emotional social network demo — deploys on **Vercel** with **PostgreSQL** (Neon recommended).

---

## Deploy to Vercel (production)

### Why SQLite failed on Vercel

Vercel uses **serverless functions** with a **read-only filesystem**. SQLite (`file:./dev.db`) cannot persist data and will crash or lose all users on every request.

**Fix:** PostgreSQL hosted on [Neon](https://neon.tech) (free tier, works natively with Vercel).

### Step 1 — Create a Neon database

1. Go to [neon.tech](https://neon.tech) → create a project
2. Copy both connection strings from the dashboard:
   - **Pooled connection** → `DATABASE_URL` (hostname contains `-pooler`)
   - **Direct connection** → `DIRECT_URL`

Example:
```
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 2 — Push to GitHub & import on Vercel

1. Push this repo to GitHub
2. [vercel.com/new](https://vercel.com/new) → Import repository
3. Framework preset: **Next.js** (auto-detected)
4. Do **not** override the build command — uses `vercel-build` script automatically

### Step 3 — Set environment variables on Vercel

In **Project → Settings → Environment Variables**, add:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Neon connection string (`?sslmode=require`) — pooled or direct both work | ✅ |
| `JWT_SECRET` | Long random string | ✅ |
| `ADMIN_SECRET` | Random string for seeding demo data | Optional |

> `DIRECT_URL` is **not required** — schema is applied via WebSocket during build.

Apply to **Production**, **Preview**, and **Development**.

### Step 4 — Deploy

Click **Deploy**. The build runs:

```
prisma generate → prisma migrate deploy → next build
```

This creates all database tables automatically.

### Step 5 — Seed demo data

After first successful deploy, run once:

```bash
curl -X POST https://YOUR-APP.vercel.app/api/admin/seed \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

Or locally (with Neon URLs in `.env`):

```bash
npm run db:seed
```

**Demo login:** `demo@moodcast.app` / `demo1234`

### Step 6 — Verify deployment

```bash
curl https://YOUR-APP.vercel.app/api/health
```

Expected:
```json
{ "ok": true, "db": "connected", "env": { "hasDatabaseUrl": true, ... } }
```

---

## Local development

### Option A — Docker Postgres

```bash
docker compose up -d
npm install
npm run db:migrate   # first time only
npm run db:seed
npm run dev
```

### Option B — Use Neon for local too

Paste the same Neon `DATABASE_URL` and `DIRECT_URL` into `.env`.

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-local-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_SECRET="optional-for-seed-api"
```

---

## Features

| Feature | Status |
|---------|--------|
| Auth (email/password) | ✅ |
| Daily mood check-in | ✅ |
| AI mood matching (keyword engine) | ✅ |
| 24h mood rooms (max 12) | ✅ |
| Change mood & switch rooms | ✅ |
| MoodCast Feed (persistent) | ✅ |
| MoodCoins wallet | ✅ |
| Reactions only (no comments) | ✅ |

**Demo login:** `demo@moodcast.app` / `demo1234`

---

## Troubleshooting Vercel

| Problem | Solution |
|---------|----------|
| `Timed out fetching a new connection from the connection pool` | Restart dev server (`Ctrl+C` then `npm run dev`). Use direct URL locally with `connection_limit=5` in `.env` |
| `Can't reach database server` (pooler) | Use **direct** URL locally. Pooler is for Vercel only |
| `Missing DATABASE_URL or DIRECT_URL` | Add both Neon connection strings in Vercel env vars |
| Build fails on `migrate deploy` | Ensure `DIRECT_URL` is set (direct Neon URL, not pooler) |
| Login works locally but not on Vercel | Set `JWT_SECRET` on Vercel |
| Empty feed / no users | Run `/api/admin/seed` or `npm run db:seed` |
| 500 on all API routes | Visit `/api/health` to see DB connection status |
| `Prisma Client could not locate Query Engine` | Fixed via `binaryTargets = ["native", "rhel-openssl-3.0.x"]` in schema |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 15 + React 19 + Tailwind |
| Backend | Next.js API routes (serverless) |
| Database | PostgreSQL via Prisma |
| Hosting | Vercel |
| Auth | JWT httpOnly cookies |

---

## Coin economy

| Reaction | Coins |
|----------|-------|
| ❤️ Like | 1 |
| 👍 Helpful | 5 |
| 🔖 Save | 3 |
| 📤 Share | 5 |

---

## Project structure

```
src/app/          → pages + API routes
src/components/   → UI components
src/lib/          → auth, coins, rooms, prisma, seed
prisma/           → schema + migrations
```
