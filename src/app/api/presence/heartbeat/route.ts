import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { unauthorized } from "@/lib/api-errors";

export async function POST() {
  const session = await getSession();
  if (!session) return unauthorized();

  await prisma.user.update({
    where: { id: session.sub },
    data: { lastActiveAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
