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
      course: true,
      students: { orderBy: { name: "asc" } },
    },
  });

  if (!teacher) return notFound("Teacher not found.");

  return NextResponse.json({
    teacher: {
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
      courseId: teacher.courseId,
      courseName: teacher.course.name,
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
  const courseId = typeof data.courseId === "string" ? data.courseId : "";

  if (!courseId) {
    errors.courseId = "Select a course.";
  } else if (!(await prisma.course.findUnique({ where: { id: courseId } }))) {
    errors.courseId = "Select a valid course.";
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
      course: { connect: { id: courseId } },
      user: { update: { name, email } },
    },
    include: { user: true, course: true, _count: { select: { students: true } } },
  });

  return NextResponse.json({
    teacher: {
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
      courseId: teacher.courseId,
      courseName: teacher.course.name,
      studentCount: teacher._count.students,
    },
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
