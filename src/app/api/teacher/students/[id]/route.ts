import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { forbidden, notFound } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string }> };

async function getOwnTeacherId(userId: string) {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  return teacher?.id ?? null;
}

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireRole("TEACHER");
  if (auth instanceof NextResponse) return auth;

  const teacherId = await getOwnTeacherId(auth.sub);
  if (!teacherId) return forbidden();

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { date: "desc" } },
      enrollments: {
        include: {
          course: true,
          attendance: { orderBy: { date: "desc" }, take: 30 },
        },
      },
    },
  });

  if (!student || student.teacherId !== teacherId) {
    return notFound("Student not found.");
  }

  return NextResponse.json({
    student: {
      ...student,
      enrollments: student.enrollments.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        courseName: e.course.name,
        classStartTime: e.classStartTime,
        classEndTime: e.classEndTime,
        classDays: e.classDays,
        attendance: e.attendance,
      })),
    },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole("TEACHER");
  if (auth instanceof NextResponse) return auth;

  const teacherId = await getOwnTeacherId(auth.sub);
  if (!teacherId) return forbidden();

  const { id } = await params;
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing || existing.teacherId !== teacherId) {
    return notFound("Student not found.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const level = typeof data.level === "string" ? data.level : existing.level;
  const progress =
    typeof data.progress === "number"
      ? Math.max(0, Math.min(100, data.progress))
      : existing.progress;

  if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(level)) {
    errors.level = "Select a valid level.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const student = await prisma.student.update({
    where: { id },
    data: { level: level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED", progress },
  });

  return NextResponse.json({ student });
}
