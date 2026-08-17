import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { COURSES } from "@/lib/courses";
import { requireEmail, requireString, type FieldErrors } from "@/lib/validation";

export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const students = await prisma.student.findMany({
    include: { teacher: { include: { user: true } } },
    orderBy: { joined: "desc" },
  });

  return NextResponse.json({
    students: students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      courseSlug: s.courseSlug,
      teacherId: s.teacherId,
      teacherName: s.teacher?.user.name ?? null,
      level: s.level,
      progress: s.progress,
      status: s.status,
      joined: s.joined,
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
  const courseSlug =
    typeof data.courseSlug === "string" && data.courseSlug ? data.courseSlug : null;
  const teacherId =
    typeof data.teacherId === "string" && data.teacherId ? data.teacherId : null;
  const level =
    typeof data.level === "string" ? data.level : "BEGINNER";

  if (courseSlug && !COURSES.some((c) => c.slug === courseSlug)) {
    errors.courseSlug = "Select a valid course.";
  }
  if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(level)) {
    errors.level = "Select a valid level.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { errors: { email: "A student with this email already exists." } },
      { status: 422 }
    );
  }

  const student = await prisma.student.create({
    data: {
      name,
      email,
      courseSlug,
      teacherId,
      level: level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      progress: 0,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ student });
}
