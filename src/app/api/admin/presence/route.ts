import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const users = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "TEACHER", "STAFF"] } },
    select: { id: true, name: true, role: true, lastActiveAt: true },
    orderBy: { name: "asc" },
  });

  const cutoff = Date.now() - ONLINE_WINDOW_MS;

  return NextResponse.json({
    team: users.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      lastActiveAt: u.lastActiveAt,
      online: !!u.lastActiveAt && u.lastActiveAt.getTime() > cutoff,
    })),
  });
}
