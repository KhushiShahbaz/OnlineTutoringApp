"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type AttendanceRecord = {
  id: string;
  date: string;
  present: boolean;
  lessonRemarks: string | null;
  homeworkRemarks: string | null;
  teacherComment: string | null;
};

export type EnrollmentWithAttendance = {
  id: string;
  courseName: string;
  attendance: AttendanceRecord[];
};

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function AttendancePanel({
  apiBase,
  enrollments,
}: {
  /** e.g. `/api/admin/students/${id}` or `/api/teacher/students/${id}` */
  apiBase: string;
  enrollments: EnrollmentWithAttendance[];
}) {
  const [recordsByEnrollment, setRecordsByEnrollment] = useState(
    Object.fromEntries(enrollments.map((e) => [e.id, e.attendance]))
  );
  const [enrollmentId, setEnrollmentId] = useState(enrollments[0]?.id ?? "");
  const [date, setDate] = useState(todayInputValue());
  const [present, setPresent] = useState(true);
  const [lessonRemarks, setLessonRemarks] = useState("");
  const [homeworkRemarks, setHomeworkRemarks] = useState("");
  const [teacherComment, setTeacherComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const records = recordsByEnrollment[enrollmentId] ?? [];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!enrollmentId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId,
          date,
          present,
          lessonRemarks,
          homeworkRemarks,
          teacherComment,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setRecordsByEnrollment((prev) => {
          const existing = prev[enrollmentId] ?? [];
          const withoutSameDate = existing.filter((r) => r.id !== data.attendance.id);
          return {
            ...prev,
            [enrollmentId]: [data.attendance, ...withoutSameDate].sort((a, b) =>
              a.date < b.date ? 1 : -1
            ),
          };
        });
        setPresent(true);
        setLessonRemarks("");
        setHomeworkRemarks("");
        setTeacherComment("");
      } else {
        setError(
          data?.errors?.enrollmentId ??
            data?.errors?.date ??
            data?.errors?.present ??
            "Something went wrong."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (enrollments.length === 0) {
    return (
      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-foreground">Attendance</h2>
        <Card className="mt-3 border-none bg-background shadow-none">
          <CardContent className="px-6 py-4 text-sm text-muted-foreground">
            Enroll this student in a course first to track attendance.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-sm font-semibold text-foreground">Attendance</h2>
      <Card className="mt-3 border-none bg-background shadow-none">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="attendance-course">Course</Label>
              <select
                id="attendance-course"
                value={enrollmentId}
                onChange={(e) => setEnrollmentId(e.target.value)}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {enrollments.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="attendance-date">Date</Label>
                <input
                  id="attendance-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Status</Label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPresent(true)}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                      present
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "border-input text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresent(false)}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                      !present
                        ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300"
                        : "border-input text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lessonRemarks">Today&apos;s Lesson / Readout Remarks</Label>
              <Textarea
                id="lessonRemarks"
                rows={2}
                value={lessonRemarks}
                onChange={(e) => setLessonRemarks(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="homeworkRemarks">Homework Remarks</Label>
              <Textarea
                id="homeworkRemarks"
                rows={2}
                value={homeworkRemarks}
                onChange={(e) => setHomeworkRemarks(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="teacherComment">Teacher Comment</Label>
              <Textarea
                id="teacherComment"
                rows={2}
                value={teacherComment}
                onChange={(e) => setTeacherComment(e.target.value)}
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-3 border-none bg-background shadow-none">
        <CardContent className="flex flex-col divide-y divide-border p-0">
          {records.length === 0 && (
            <p className="px-6 py-4 text-sm text-muted-foreground">
              No attendance recorded yet for this course.
            </p>
          )}
          {records.map((r) => (
            <div key={r.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {new Date(r.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    r.present
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                  }`}
                >
                  {r.present ? "Present" : "Absent"}
                </span>
              </div>
              {r.lessonRemarks && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Lesson: {r.lessonRemarks}
                </p>
              )}
              {r.homeworkRemarks && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Homework: {r.homeworkRemarks}
                </p>
              )}
              {r.teacherComment && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Comment: {r.teacherComment}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
