import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "@/lib/api-errors";
import { requireString, type FieldErrors } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { _count: { select: { students: true, teachers: true } } },
  });

  if (!course) return notFound("Course not found.");

  return NextResponse.json({
    course: {
      id: course.id,
      slug: course.slug,
      name: course.name,
      description: course.description,
      summary: course.summary,
      topics: course.topics,
      color: course.color,
      icon: course.icon,
      studentCount: course._count.students,
      teacherCount: course._count.teachers,
    },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) return notFound("Course not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = requireString(errors, "name", data.name, "Course name", {
    min: 2,
    max: 100,
  });
  const summary = requireString(errors, "summary", data.summary, "Summary", {
    min: 10,
    max: 1000,
  });
  const description =
    typeof data.description === "string" ? data.description.trim() || null : existing.description;
  const color = typeof data.color === "string" && data.color ? data.color : existing.color;
  const icon = typeof data.icon === "string" && data.icon ? data.icon : existing.icon;
  const topics = Array.isArray(data.topics)
    ? data.topics.filter((t): t is string => typeof t === "string" && t.trim().length > 0).map((t) => t.trim())
    : existing.topics;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const course = await prisma.course.update({
    where: { id },
    data: { name, summary, description, color, icon, topics },
    include: { _count: { select: { students: true, teachers: true } } },
  });

  return NextResponse.json({
    course: {
      id: course.id,
      slug: course.slug,
      name: course.name,
      description: course.description,
      summary: course.summary,
      topics: course.topics,
      color: course.color,
      icon: course.icon,
      studentCount: course._count.students,
      teacherCount: course._count.teachers,
    },
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.course.findUnique({
    where: { id },
    include: { _count: { select: { teachers: true } } },
  });
  if (!existing) return notFound("Course not found.");

  if (existing._count.teachers > 0) {
    return NextResponse.json(
      {
        error:
          "This course still has teachers assigned to it. Reassign or remove them first.",
      },
      { status: 409 }
    );
  }

  // Any students enrolled in this course are simply unenrolled from it
  // (the implicit join table row is cascade-deleted); their other
  // enrollments and records are untouched.
  await prisma.course.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
