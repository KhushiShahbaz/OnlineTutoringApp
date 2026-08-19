import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { sendAccountCreatedEmail } from "@/lib/mailer";
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
    include: { user: true, courses: true, _count: { select: { students: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return NextResponse.json({
    teachers: teachers.map((t) => ({
      id: t.id,
      name: t.user.name,
      email: t.user.email,
      courseIds: t.courses.map((c) => c.id),
      courseNames: t.courses.map((c) => c.name),
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
  const courseIds = Array.isArray(data.courseIds)
    ? data.courseIds.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];

  if (courseIds.length === 0) {
    errors.courseIds = "Select at least one course.";
  } else {
    const validCount = await prisma.course.count({ where: { id: { in: courseIds } } });
    if (validCount !== courseIds.length) {
      errors.courseIds = "Select valid courses.";
    }
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
      teacher: { create: { courses: { connect: courseIds.map((id) => ({ id })) } } },
    },
    include: { teacher: { include: { courses: true } } },
  });

  const courseNames = user.teacher!.courses.map((c) => c.name);

  sendAccountCreatedEmail({
    to: email,
    name,
    role: "TEACHER",
    email,
    password,
    details: [{ label: courseNames.length > 1 ? "Courses" : "Course", value: courseNames.join(", ") }],
  }).catch((error) => {
    console.error("Failed to send account-created email", error);
  });

  return NextResponse.json({
    teacher: {
      id: user.teacher!.id,
      name: user.name,
      email: user.email,
      courseIds: user.teacher!.courses.map((c) => c.id),
      courseNames,
      studentCount: 0,
    },
  });
}
