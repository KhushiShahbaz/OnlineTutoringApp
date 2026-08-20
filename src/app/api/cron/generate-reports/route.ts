import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronRequest } from "@/lib/cron-auth";
import { generateMonthlyReport, generateWeeklyReport } from "@/lib/reports";

function mostRecentMonday(date: Date) {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() + diff);
  return monday;
}

/** Runs daily; generates weekly reports every Monday and monthly reports on the 1st. */
export async function GET(request: Request) {
  const authError = verifyCronRequest(request);
  if (authError) return authError;

  const now = new Date();
  const isMonday = now.getUTCDay() === 1;
  const isFirstOfMonth = now.getUTCDate() === 1;

  if (!isMonday && !isFirstOfMonth) {
    return NextResponse.json({ weeklyReports: 0, monthlyReports: 0, skipped: true });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { student: { status: "ACTIVE" } },
  });

  let weeklyReports = 0;
  let monthlyReports = 0;

  if (isMonday) {
    const weekStart = mostRecentMonday(now);
    weekStart.setUTCDate(weekStart.getUTCDate() - 7);
    for (const enrollment of enrollments) {
      await generateWeeklyReport(enrollment.id, weekStart);
      weeklyReports += 1;
    }
  }

  if (isFirstOfMonth) {
    const prevMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const month = prevMonthDate.getUTCMonth() + 1;
    const year = prevMonthDate.getUTCFullYear();
    for (const enrollment of enrollments) {
      await generateMonthlyReport(enrollment.id, month, year);
      monthlyReports += 1;
    }
  }

  return NextResponse.json({ weeklyReports, monthlyReports });
}
