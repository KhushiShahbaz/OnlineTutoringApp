import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import {
  requireEmail,
  requirePassword,
  requireString,
  type FieldErrors,
} from "@/lib/validation";

export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const teachers = await prisma.teacher.findMany({
    include: { user: true, course: true, _count: { select: { students: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return NextResponse.json({
    teachers: teachers.map((t) => ({
      id: t.id,
      name: t.user.name,
      email: t.user.email,
      courseId: t.courseId,
      courseName: t.course.name,
      studentCount: t._count.students,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = requireString(errors, "name", data.name, "Full name", {
    min: 2,
    max: 100,
  });
  const email = requireEmail(errors, "email", data.email);
  const password = requirePassword(errors, "password", data.password);
  const courseId = typeof data.courseId === "string" ? data.courseId : "";

  if (!courseId) {
    errors.courseId = "Select a course.";
  } else if (!(await prisma.course.findUnique({ where: { id: courseId } }))) {
    errors.courseId = "Select a valid course.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { errors: { email: "An account with this email already exists." } },
      { status: 422 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "TEACHER",
      teacher: { create: { courseId } },
    },
    include: { teacher: { include: { course: true } } },
  });

  return NextResponse.json({
    teacher: {
      id: user.teacher!.id,
      name: user.name,
      email: user.email,
      courseId: user.teacher!.courseId,
      courseName: user.teacher!.course.name,
      studentCount: 0,
    },
  });
}
