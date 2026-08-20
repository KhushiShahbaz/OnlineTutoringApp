import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronRequest } from "@/lib/cron-auth";
import { createInvoiceForStudent } from "@/lib/invoices";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Runs daily; only actually generates invoices on the 1st of the month. */
export async function GET(request: Request) {
  const authError = verifyCronRequest(request);
  if (authError) return authError;

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const monthName = MONTH_NAMES[now.getUTCMonth()];
  const dueDate = new Date(now);
  dueDate.setUTCDate(dueDate.getUTCDate() + 7);

  const students = await prisma.student.findMany({
    where: { status: "ACTIVE", monthlyFee: { not: null } },
  });

  let created = 0;
  for (const student of students) {
    const existing = await prisma.invoice.findFirst({
      where: { studentId: student.id, date: { gte: monthStart, lt: nextMonthStart } },
    });
    if (existing) continue;

    const invoice = await createInvoiceForStudent({
      studentId: student.id,
      description: `Monthly fee — ${monthName} ${now.getUTCFullYear()}`,
      amount: student.monthlyFee!,
      dueDate,
    });
    if (invoice) created += 1;
  }

  return NextResponse.json({ studentsChecked: students.length, invoicesCreated: created });
}
