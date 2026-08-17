import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { forbidden, notFound } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole("TEACHER");
  if (auth instanceof NextResponse) return auth;

  const teacher = await prisma.teacher.findUnique({ where: { userId: auth.sub } });
  if (!teacher) return forbidden();

  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student || student.teacherId !== teacher.id) {
    return notFound("Student not found.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const note = typeof data.note === "string" ? data.note.trim() : "";
  if (!note) {
    return NextResponse.json(
      { errors: { note: "Note text is required." } },
      { status: 422 }
    );
  }

  const created = await prisma.progressNote.create({
    data: { studentId: id, note },
  });

  return NextResponse.json({ note: created });
}
