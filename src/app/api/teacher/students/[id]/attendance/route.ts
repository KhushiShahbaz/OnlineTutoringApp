import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { forbidden, notFound } from "@/lib/api-errors";
import { parseAttendanceBody } from "@/lib/attendance";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole("TEACHER");
  if (auth instanceof NextResponse) return auth;

  const teacher = await prisma.teacher.findUnique({ where: { userId: auth.sub } });
  if (!teacher) return forbidden();

  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student || student.teacherId !== teacher.id) {
    return notFound("Student not found.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseAttendanceBody(body as Record<string, unknown>);
  if ("errors" in parsed) {
    return NextResponse.json({ errors: parsed.errors }, { status: 422 });
  }

  const { enrollmentId, date, present, lessonRemarks, homeworkRemarks, teacherComment } =
    parsed.value;

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.studentId !== id) {
    return NextResponse.json({ errors: { enrollmentId: "Select a valid course." } }, { status: 422 });
  }

  const attendance = await prisma.attendance.upsert({
    where: { enrollmentId_date: { enrollmentId, date } },
    update: { present, lessonRemarks, homeworkRemarks, teacherComment },
    create: { enrollmentId, date, present, lessonRemarks, homeworkRemarks, teacherComment },
  });

  return NextResponse.json({ attendance });
}
