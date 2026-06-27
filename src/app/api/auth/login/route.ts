import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await createSession({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        moodCoins: user.moodCoins,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
