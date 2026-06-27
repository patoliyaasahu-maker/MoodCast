import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CheckInForm } from "@/components/CheckInForm";
import { ChangeMoodSection } from "@/components/ChangeMoodSection";
import { Card } from "@/components/Card";
import { requireUser } from "@/lib/auth";
import { formatTimeRemaining } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const { getActiveRoomForUser } = await import("@/lib/rooms");
  const { prisma } = await import("@/lib/prisma");

  const room = await getActiveRoomForUser(user.id);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCheckIn = await prisma.moodCheckIn.findFirst({
    where: { userId: user.id, createdAt: { gte: todayStart } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <Navbar user={{ displayName: user.displayName, moodCoins: user.moodCoins }} />
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Today&apos;s mood</h1>
            <p className="text-sm text-slate-400">
              {user.moodCoins} MoodCoins · {user.isPremium ? "Premium" : "Free"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/feed"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-violet-300 hover:bg-white/5"
            >
              Feed
            </Link>
            <Link
              href="/wallet"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-violet-300 hover:bg-white/5"
            >
              Wallet
            </Link>
          </div>
        </div>

        {todayCheckIn && (
          <Card title="Your check-in today">
            <p className="mb-2 text-xs uppercase text-violet-400">{todayCheckIn.moodLabel}</p>
            <p className="text-sm text-slate-200">{todayCheckIn.text}</p>
          </Card>
        )}

        {room ? (
          <>
            <Card>
              <p className="text-xs uppercase text-violet-400">{room.moodLabel}</p>
              <h2 className="text-xl font-semibold text-white">{room.name}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {room._count.members} members · {formatTimeRemaining(room.expiresAt)}
              </p>
              <Link
                href={`/room/${room.id}`}
                className="mt-4 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-2 text-sm font-medium text-white"
              >
                Enter room
              </Link>
            </Card>
            <ChangeMoodSection
              currentMoodLabel={room.moodLabel}
              currentRoomName={room.name}
            />
          </>
        ) : (
          <CheckInForm />
        )}

        {!room && todayCheckIn && <CheckInForm />}
      </main>
    </div>
  );
}
