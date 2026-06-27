import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REDEEM_OPTIONS } from "@/lib/coins";

const schema = z.object({
  optionId: z.enum(["premium", "gift50", "gift100"]),
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { optionId } = schema.parse(body);

    const option = REDEEM_OPTIONS.find((o) => o.id === optionId);
    if (!option) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    if (user.moodCoins < option.cost) {
      return NextResponse.json({ error: "Insufficient MoodCoins" }, { status: 400 });
    }

    const reason = optionId === "premium" ? "REDEEM_PREMIUM" : "REDEEM_GIFT";

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          moodCoins: { decrement: option.cost },
          ...(optionId === "premium" ? { isPremium: true } : {}),
        },
      }),
      prisma.coinTransaction.create({
        data: {
          userId: user.id,
          amount: -option.cost,
          reason,
          metadata: JSON.stringify({ optionId, label: option.label }),
        },
      }),
    ]);

    const updated = await prisma.user.findUnique({ where: { id: user.id } });

    return NextResponse.json({
      success: true,
      message: `Redeemed ${option.label} (demo — no real payout)`,
      balance: updated!.moodCoins,
      isPremium: updated!.isPremium,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Redemption failed" }, { status: 500 });
  }
}
