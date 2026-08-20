export type AttendanceInput = {
  enrollmentId: string;
  date: Date;
  present: boolean;
  lessonRemarks: string | null;
  homeworkRemarks: string | null;
  teacherComment: string | null;
};

export function parseAttendanceBody(
  data: Record<string, unknown>
): { value: AttendanceInput } | { errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const enrollmentId = typeof data.enrollmentId === "string" ? data.enrollmentId : "";
  if (!enrollmentId) {
    errors.enrollmentId = "Select a course.";
  }

  const dateStr = typeof data.date === "string" ? data.date : "";
  const date = dateStr ? new Date(dateStr) : null;
  if (!date || Number.isNaN(date.getTime())) {
    errors.date = "A valid date is required.";
  }

  const present = typeof data.present === "boolean" ? data.present : null;
  if (present === null) {
    errors.present = "Mark present or absent.";
  }

  const lessonRemarks =
    typeof data.lessonRemarks === "string" ? data.lessonRemarks.trim() || null : null;
  const homeworkRemarks =
    typeof data.homeworkRemarks === "string" ? data.homeworkRemarks.trim() || null : null;
  const teacherComment =
    typeof data.teacherComment === "string" ? data.teacherComment.trim() || null : null;

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    value: {
      enrollmentId,
      date: date!,
      present: present!,
      lessonRemarks,
      homeworkRemarks,
      teacherComment,
    },
  };
}
