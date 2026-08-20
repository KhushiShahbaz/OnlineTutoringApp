import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "@/lib/api-errors";

export async function GET() {
  const auth = await requireRole("STUDENT");
  if (auth instanceof NextResponse) return auth;

  const student = await prisma.student.findUnique({
    where: { userId: auth.sub },
    include: {
      teacher: { include: { user: true } },
      enrollments: {
        include: {
          course: true,
          attendance: { orderBy: { date: "desc" }, take: 7 },
        },
      },
      invoices: { orderBy: { date: "desc" } },
      notifications: { orderBy: { date: "desc" } },
    },
  });

  if (!student) {
    return NextResponse.json({ student: null });
  }

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      whatsapp: student.whatsapp,
      parentName: student.parentName,
      parentContact: student.parentContact,
      courses: student.enrollments.map((e) => ({
        id: e.course.id,
        slug: e.course.slug,
        name: e.course.name,
        color: e.course.color,
        icon: e.course.icon,
        classStartTime: e.classStartTime,
        classEndTime: e.classEndTime,
        classDays: e.classDays,
        attendance: e.attendance,
      })),
      teacherName: student.teacher?.user.name ?? null,
      level: student.level,
      progress: student.progress,
      status: student.status,
      joined: student.joined,
      invoices: student.invoices,
      notifications: student.notifications,
    },
  });
}

export async function PATCH(request: Request) {
  const auth = await requireRole("STUDENT");
  if (auth instanceof NextResponse) return auth;

  const existing = await prisma.student.findUnique({ where: { userId: auth.sub } });
  if (!existing) return notFound("Student profile not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = typeof data.name === "string" ? data.name.trim() : existing.name;
  const phone = typeof data.phone === "string" ? data.phone.trim() : existing.phone;

  if (!name) errors.name = "Full name is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const student = await prisma.student.update({
    where: { id: existing.id },
    data: { name, phone },
  });

  return NextResponse.json({ student });
}
