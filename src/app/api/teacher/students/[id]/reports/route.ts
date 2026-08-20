import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "@/lib/api-errors";
import { generateMonthlyReport, generateWeeklyReport } from "@/lib/reports";

type Params = { params: Promise<{ id: string }> };

async function getOwnStudent(userId: string, studentId: string) {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) return null;
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.teacherId !== teacher.id) return null;
  return student;
}

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireRole("TEACHER");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const student = await getOwnStudent(auth.sub, id);
  if (!student) return notFound("Student not found.");

  const [weeklyReports, monthlyReports] = await Promise.all([
    prisma.weeklyReport.findMany({
      where: { enrollment: { studentId: id } },
      include: { enrollment: { include: { course: true } } },
      orderBy: { weekStart: "desc" },
    }),
    prisma.monthlyReport.findMany({
      where: { enrollment: { studentId: id } },
      include: { enrollment: { include: { course: true } } },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    }),
  ]);

  return NextResponse.json({
    weeklyReports: weeklyReports.map((r) => ({ ...r, courseName: r.enrollment.course.name })),
    monthlyReports: monthlyReports.map((r) => ({ ...r, courseName: r.enrollment.course.name })),
  });
}

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole("TEACHER");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const student = await getOwnStudent(auth.sub, id);
  if (!student) return notFound("Student not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const type = typeof data.type === "string" ? data.type : "";
  const enrollmentId = typeof data.enrollmentId === "string" ? data.enrollmentId : "";

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.studentId !== id) {
    return NextResponse.json({ errors: { enrollmentId: "Select a valid course." } }, { status: 422 });
  }

  if (type === "weekly") {
    const weekStartStr = typeof data.weekStart === "string" ? data.weekStart : "";
    const weekStart = weekStartStr ? new Date(weekStartStr) : null;
    if (!weekStart || Number.isNaN(weekStart.getTime())) {
      return NextResponse.json(
        { errors: { weekStart: "A valid week start date is required." } },
        { status: 422 }
      );
    }
    const report = await generateWeeklyReport(enrollmentId, weekStart);
    return NextResponse.json({ weeklyReport: report });
  }

  if (type === "monthly") {
    const month = typeof data.month === "number" ? data.month : NaN;
    const year = typeof data.year === "number" ? data.year : NaN;
    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year)) {
      return NextResponse.json(
        { errors: { month: "A valid month and year are required." } },
        { status: 422 }
      );
    }
    const report = await generateMonthlyReport(enrollmentId, month, year);
    return NextResponse.json({ monthlyReport: report });
  }

  return NextResponse.json({ errors: { type: "type must be 'weekly' or 'monthly'." } }, { status: 422 });
}
