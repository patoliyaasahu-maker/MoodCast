import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(40),
  city: z.string().max(60).optional(),
  anonymousAlias: z.string().min(2).max(30).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: await hashPassword(data.password),
        displayName: data.displayName,
        city: data.city,
        anonymousAlias: data.anonymousAlias,
      },
    });

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
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
