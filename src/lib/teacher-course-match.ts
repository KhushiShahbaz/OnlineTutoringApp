import { prisma } from "@/lib/prisma";

/**
 * Enforces that a student can only be assigned to a teacher who teaches
 * at least one course the student is enrolled in. Returns an error
 * message if the pairing is invalid, or null if it's fine (including
 * when there's no teacher to check).
 */
export async function checkTeacherTeachesStudentCourse(
  teacherId: string | null,
  courseIds: string[]
): Promise<string | null> {
  if (!teacherId) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { courses: true },
  });
  if (!teacher) return "Select a valid teacher.";

  if (courseIds.length === 0) {
    return "Assign at least one course before assigning a teacher.";
  }

  const teacherCourseIds = new Set(teacher.courses.map((c) => c.id));
  const overlaps = courseIds.some((id) => teacherCourseIds.has(id));

  return overlaps
    ? null
    : "This teacher doesn't teach any of the student's courses.";
}
