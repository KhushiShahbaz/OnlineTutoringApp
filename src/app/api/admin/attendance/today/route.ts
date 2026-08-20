import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function startOfDayUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const today = startOfDayUTC(new Date());
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const records = await prisma.attendance.findMany({
    where: { date: { gte: today, lt: tomorrow } },
    select: { present: true },
  });

  const totalCount = records.length;
  const presentCount = records.filter((r) => r.present).length;

  return NextResponse.json({ presentCount, totalCount });
}
