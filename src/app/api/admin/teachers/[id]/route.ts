import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "@/lib/api-errors";
import { requireEmail, requireString, type FieldErrors } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: true,
      courses: true,
      students: { orderBy: { name: "asc" } },
    },
  });

  if (!teacher) return notFound("Teacher not found.");

  return NextResponse.json({
    teacher: {
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
      courseIds: teacher.courses.map((c) => c.id),
      courseNames: teacher.courses.map((c) => c.name),
      students: teacher.students.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        level: s.level,
        progress: s.progress,
        status: s.status,
      })),
    },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.teacher.findUnique({ where: { id }, include: { user: true } });
  if (!existing) return notFound("Teacher not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = requireString(errors, "name", data.name, "Full name", { min: 2, max: 100 });
  const email = requireEmail(errors, "email", data.email);
  const courseIds = Array.isArray(data.courseIds)
    ? data.courseIds.filter((cid): cid is string => typeof cid === "string" && cid.length > 0)
    : [];

  if (courseIds.length === 0) {
    errors.courseIds = "Select at least one course.";
  } else {
    const validCount = await prisma.course.count({ where: { id: { in: courseIds } } });
    if (validCount !== courseIds.length) {
      errors.courseIds = "Select valid courses.";
    }
  }

  if (Object.keys(errors).length === 0 && email !== existing.user.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) errors.email = "An account with this email already exists.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const teacher = await prisma.teacher.update({
    where: { id },
    data: {
      courses: { set: courseIds.map((cid) => ({ id: cid })) },
      user: { update: { name, email } },
    },
    include: { user: true, courses: true, _count: { select: { students: true } } },
  });

  // If a course was removed, unassign any students who no longer share
  // any course with this teacher — keeps the roster consistent with the
  // "only students enrolled in a course you teach" rule.
  const stillAssigned = await prisma.student.findMany({
    where: { teacherId: id },
    include: { courses: true },
  });
  const teacherCourseIds = new Set(courseIds);
  const toUnassign = stillAssigned
    .filter((s) => !s.courses.some((c) => teacherCourseIds.has(c.id)))
    .map((s) => s.id);
  if (toUnassign.length > 0) {
    await prisma.student.updateMany({
      where: { id: { in: toUnassign } },
      data: { teacherId: null },
    });
  }

  return NextResponse.json({
    teacher: {
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
      courseIds: teacher.courses.map((c) => c.id),
      courseNames: teacher.courses.map((c) => c.name),
      studentCount: teacher._count.students - toUnassign.length,
    },
    unassignedStudentCount: toUnassign.length,
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.teacher.findUnique({ where: { id } });
  if (!existing) return notFound("Teacher not found.");

  // Deleting the User cascades to the Teacher row, and any assigned
  // students have their teacherId set to null (see schema.prisma).
  await prisma.user.delete({ where: { id: existing.userId } });

  return NextResponse.json({ ok: true });
}
