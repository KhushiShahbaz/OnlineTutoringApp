import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { notes: { orderBy: { date: "desc" } }, courses: true },
  });

  if (!student) return notFound("Student not found.");

  return NextResponse.json({
    student: {
      ...student,
      courseIds: student.courses.map((c) => c.id),
      courseNames: student.courses.map((c) => c.name),
    },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) return notFound("Student not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = typeof data.name === "string" ? data.name.trim() : existing.name;
  const email = typeof data.email === "string" ? data.email.trim() : existing.email;
  const courseIds = Array.isArray(data.courseIds)
    ? data.courseIds.filter((cid): cid is string => typeof cid === "string" && cid.length > 0)
    : undefined;
  const teacherId =
    typeof data.teacherId === "string" ? data.teacherId || null : existing.teacherId;
  const level = typeof data.level === "string" ? data.level : existing.level;
  const status = typeof data.status === "string" ? data.status : existing.status;
  const progress =
    typeof data.progress === "number" ? Math.max(0, Math.min(100, data.progress)) : existing.progress;

  if (!name) errors.name = "Full name is required.";
  if (!email) errors.email = "Email is required.";
  if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(level)) {
    errors.level = "Select a valid level.";
  }
  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    errors.status = "Select a valid status.";
  }
  if (courseIds && courseIds.length > 0) {
    const validCount = await prisma.course.count({ where: { id: { in: courseIds } } });
    if (validCount !== courseIds.length) {
      errors.courseIds = "Select valid courses.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const student = await prisma.student.update({
    where: { id },
    data: {
      name,
      email,
      teacherId,
      level: level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      status: status as "ACTIVE" | "INACTIVE",
      progress,
      ...(courseIds !== undefined
        ? { courses: { set: courseIds.map((cid) => ({ id: cid })) } }
        : {}),
    },
    include: { courses: true },
  });

  return NextResponse.json({
    student: {
      ...student,
      courseIds: student.courses.map((c) => c.id),
      courseNames: student.courses.map((c) => c.name),
    },
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) return notFound("Student not found.");

  // Notes, invoices, and notifications cascade with the Student row
  // (see schema.prisma). Delete first, then remove any linked login
  // account separately, since that relation only nulls out on delete.
  await prisma.student.delete({ where: { id } });
  if (existing.userId) {
    await prisma.user.delete({ where: { id: existing.userId } });
  }

  return NextResponse.json({ ok: true });
}
