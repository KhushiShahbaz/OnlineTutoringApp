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
  const teacher = await prisma.teacher.findUnique({ where: { id } });
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
    const validCount = await prisma.student.count({ where: { id: { in: studentIds } } });
    if (validCount !== studentIds.length) {
      return NextResponse.json(
        { error: "One or more selected students could not be found." },
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
