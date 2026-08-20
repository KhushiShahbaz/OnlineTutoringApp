import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string; enrollmentId: string }> };

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const VALID_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id, enrollmentId } = await params;
  const existing = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!existing || existing.studentId !== id) return notFound("Enrollment not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const classStartTime =
    typeof data.classStartTime === "string"
      ? data.classStartTime.trim() || null
      : existing.classStartTime;
  const classEndTime =
    typeof data.classEndTime === "string"
      ? data.classEndTime.trim() || null
      : existing.classEndTime;
  if (classStartTime && !TIME_REGEX.test(classStartTime)) {
    errors.classStartTime = "Enter a valid time (HH:MM).";
  }
  if (classEndTime && !TIME_REGEX.test(classEndTime)) {
    errors.classEndTime = "Enter a valid time (HH:MM).";
  }

  const classDays = Array.isArray(data.classDays)
    ? data.classDays.filter((d): d is string => typeof d === "string")
    : existing.classDays;
  if (!classDays.every((d) => (VALID_DAYS as readonly string[]).includes(d))) {
    errors.classDays = "Select valid class days.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      classStartTime,
      classEndTime,
      classDays: classDays as (typeof VALID_DAYS)[number][],
    },
    include: { course: true },
  });

  return NextResponse.json({ enrollment });
}
