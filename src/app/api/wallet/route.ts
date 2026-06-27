import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REDEEM_OPTIONS } from "@/lib/coins";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.coinTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    balance: user.moodCoins,
    isPremium: user.isPremium,
    redeemOptions: REDEEM_OPTIONS,
    transactions,
    exchangeRate: "10 MoodCoins = ₹1",
  });
}
