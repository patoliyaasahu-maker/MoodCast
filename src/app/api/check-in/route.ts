import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { processCheckIn } from "@/lib/rooms";

const schema = z.object({
  text: z.string().min(3).max(2000),
  changeMood: z.boolean().optional(),
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { text, changeMood } = schema.parse(body);

    const { checkIn, analysis, room, moodChanged } = await processCheckIn(
      user.id,
      text,
      { changeMood }
    );

    return NextResponse.json({
      checkIn: {
        id: checkIn.id,
        text: checkIn.text,
        moodLabel: checkIn.moodLabel,
        moodScore: checkIn.moodScore,
        createdAt: checkIn.createdAt,
      },
      analysis,
      moodChanged,
      room: {
        id: room.id,
        name: room.name,
        moodLabel: room.moodLabel,
        expiresAt: room.expiresAt,
        memberCount: room._count.members,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
