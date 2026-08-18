import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string }> };

// Replaces this teacher's full student roster with the given list of
// student ids: unassigns anyone currently assigned but not in the list,
// and assigns everyone in the list to this teacher.
export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { courses: true },
  });
  if (!teacher) return notFound("Teacher not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const studentIds = Array.isArray(data.studentIds)
    ? data.studentIds.filter((sid): sid is string => typeof sid === "string" && sid.length > 0)
    : [];

  if (studentIds.length > 0) {
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      include: { courses: true },
    });
    if (students.length !== studentIds.length) {
      return NextResponse.json(
        { error: "One or more selected students could not be found." },
        { status: 422 }
      );
    }

    const teacherCourseIds = new Set(teacher.courses.map((c) => c.id));
    const notEnrolled = students.filter(
      (s) => !s.courses.some((c) => teacherCourseIds.has(c.id))
    );
    if (notEnrolled.length > 0) {
      return NextResponse.json(
        {
          error: `${notEnrolled
            .map((s) => s.name)
            .join(", ")} ${notEnrolled.length === 1 ? "is" : "are"} not enrolled in a course this teacher teaches.`,
        },
        { status: 422 }
      );
    }
  }

  await prisma.$transaction([
    prisma.student.updateMany({
      where: { teacherId: id, id: { notIn: studentIds } },
      data: { teacherId: null },
    }),
    prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: { teacherId: id },
    }),
  ]);

  const students = await prisma.student.findMany({
    where: { teacherId: id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    students: students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      level: s.level,
      progress: s.progress,
      status: s.status,
    })),
  });
}
