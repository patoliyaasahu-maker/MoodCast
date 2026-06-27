import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET is not configured on this deployment" },
      { status: 503 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: "Demo data seeded",
      ...result,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
