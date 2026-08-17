"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { COURSES } from "@/lib/courses";

type Student = {
  id: string;
  name: string;
  email: string;
  courseSlug: string | null;
  teacherId: string | null;
  teacherName: string | null;
  level: string;
  progress: number;
  status: string;
};

type Teacher = { id: string; name: string };

const EMPTY_FORM = {
  name: "",
  email: "",
  courseSlug: COURSES[0]?.slug ?? "",
  teacherId: "",
  level: "BEGINNER",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/students").then((r) => r.json()),
      fetch("/api/admin/teachers").then((r) => r.json()),
    ]).then(([studentsData, teachersData]) => {
      if (!active) return;
      setStudents(studentsData.students ?? []);
      setTeachers(teachersData.teachers ?? []);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { form: data.error ?? "Something went wrong." });
        return;
      }

      const teacher = teachers.find((t) => t.id === form.teacherId);
      setStudents((prev) => [
        {
          id: data.student.id,
          name: data.student.name,
          email: data.student.email,
          courseSlug: data.student.courseSlug,
          teacherId: data.student.teacherId,
          teacherName: teacher?.name ?? null,
          level: data.student.level,
          progress: data.student.progress,
          status: data.student.status,
        },
        ...(prev ?? []),
      ]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage student records and course assignments.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {showForm && (
        <Card className="border-none bg-background shadow-none">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  value={form.courseSlug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, courseSlug: e.target.value }))
                  }
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                >
                  {COURSES.map((course) => (
                    <option key={course.slug} value={course.slug}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="teacher">Assign Teacher</Label>
                <select
                  id="teacher"
                  value={form.teacherId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, teacherId: e.target.value }))
                  }
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                >
                  <option value="">Unassigned</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="level">Study Level</Label>
                <select
                  id="level"
                  value={form.level}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, level: e.target.value }))
                  }
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Student"}
                </Button>
                {errors.form && (
                  <p className="text-xs text-destructive">{errors.form}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-none bg-background shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Course</th>
                  <th className="px-6 py-3 font-medium">Teacher</th>
                  <th className="px-6 py-3 font-medium">Level</th>
                  <th className="px-6 py-3 font-medium">Progress</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students === null && (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                )}
                {students?.map((student) => {
                  const course = COURSES.find((c) => c.slug === student.courseSlug);
                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {course?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.teacherName ?? "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.level}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.progress}%
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={student.status === "ACTIVE" ? "default" : "outline"}
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
