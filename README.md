# MoodCast MVP

**Share how you feel. Not how you look.**

Working demo MVP for tomorrow's showcase. Runs locally with SQLite (no Docker required).

## Quick start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `demo@moodcast.app` / `demo1234`

### Optional: PostgreSQL via Docker

```bash
docker compose up -d
# Set DATABASE_URL in .env to postgresql://moodcast:moodcast@localhost:5433/moodcast
# Change provider in prisma/schema.prisma to postgresql
npm run db:push
```

## Showcase flow (5 min demo)

1. **Landing** → explain vision
2. **Register** or login as demo user
3. **Check-in** → type "I'm stressed about work today"
4. **Room** → auto-matched to Stressed room (up to 12 users)
5. **Post** → share an emotional thought
6. **React** → second user earns author MoodCoins (❤️1 👍5 🔖3 📤5)
7. **Wallet** → view balance & demo redemption

## MVP scope (IN)

| Feature | Status |
|---------|--------|
| Email/password auth | ✅ |
| Anonymous alias in rooms | ✅ |
| Daily mood check-in | ✅ |
| Keyword mood matching (no OpenAI) | ✅ |
| Auto room assignment (max 12) | ✅ |
| 24h room expiry | ✅ |
| **Change mood & switch rooms** | ✅ |
| Posts in rooms | ✅ |
| **MoodCast Feed** (persistent public feed) | ✅ |
| Publish to feed from room | ✅ |
| Reactions only (no comments) | ✅ |
| MoodCoins wallet & ledger | ✅ |
| Demo redemption | ✅ |

## MVP scope (OUT — later)

- OpenAI / crisis detection
- Vent canvas (voice/sketch)
- Creator economy & cash payouts
- Premium payments (Razorpay)
- Mobile apps
- B2B dashboards
- K8s / cloud deploy
- Push notifications

## Conflict resolutions (demo)

| # | Decision |
|---|----------|
| C1 | Ephemeral only — rooms & posts deleted after 24h |
| C2 | Rolling 24h from room creation |
| C3 | Like=1, Helpful=5, Save=3, Share=5 |
| C4 | Post authors earn coins |
| C5 | Email auth + anonymous alias in rooms |
| C6 | Four reactions only |
| C7 | No comments, DMs, or replies |
| C8 | Vent canvas deferred |
| C9 | Auto-match after check-in |
| C11 | Minimal web MVP only |

## Assumptions A–H (demo)

- **A** No K8s — Docker Compose locally
- **B** Wallet demo only — no real UPI payouts
- **C** No post archive after expiry
- **D** Email required; anonymous in rooms
- **E** Web app only (Next.js)
- **F** Keyword mood engine (no OpenAI)
- **G** Rolling 24h expiry
- **H** Share = in-app counter only

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 15 + React 19 | Full-stack, fast to ship |
| Styling | Tailwind CSS 4 | Matches pitch deck aesthetic |
| Backend | Next.js API routes | Single repo, local dev |
| Database | SQLite (demo) / PostgreSQL (prod) | Zero-config local demo |
| Auth | JWT cookies + bcrypt | Simple, no external deps |
| Mood AI | Keyword classifier | No API keys for demo |
| Infra | Local dev / Docker Compose (optional) | SQLite for instant demo |

## Coin economy

| Action | Coins |
|--------|-------|
| Like received | 1 |
| Helpful received | 5 |
| Save received | 3 |
| Share received | 5 |

Exchange: 10 coins = ₹1 (display only). Redemption is demo.

## 4-month roadmap

- **Month 1:** Mobile app, OpenAI mood + crisis, Razorpay premium
- **Month 2:** Creator economy, moderation dashboard
- **Month 3:** AWS deploy, push notifications, analytics
- **Month 4:** Public beta, campus launch, compliance (DPDP)

## Project structure

```
src/
├── app/           # Pages + API routes
├── components/    # UI components
└── lib/           # Auth, coins, mood engine, rooms, prisma
prisma/
├── schema.prisma  # Database schema
└── seed.ts        # Demo users
```
