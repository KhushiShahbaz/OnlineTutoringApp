import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { forbidden } from "@/lib/api-errors";

export async function GET() {
  const auth = await requireRole("TEACHER");
  if (auth instanceof NextResponse) return auth;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: auth.sub },
    include: { user: true, course: true },
  });
  if (!teacher) return forbidden();

  const students = await prisma.student.findMany({
    where: { teacherId: teacher.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    teacher: { name: teacher.user.name, courseName: teacher.course.name },
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
