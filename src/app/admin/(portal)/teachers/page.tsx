"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURSES } from "@/lib/courses";

type Teacher = {
  id: string;
  name: string;
  email: string;
  courseSlug: string;
  studentCount: number;
};

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  courseSlug: COURSES[0]?.slug ?? "",
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/teachers")
      .then((r) => r.json())
      .then((data) => {
        if (active) setTeachers(data.teachers ?? []);
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
      const res = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { form: data.error ?? "Something went wrong." });
        return;
      }

      setTeachers((prev) => [data.teacher, ...(prev ?? [])]);
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
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage teaching staff and their assigned course.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          Add Teacher
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
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="course">Teaches</Label>
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
              <div className="flex items-end gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Teacher"}
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
                  <th className="px-6 py-3 font-medium">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teachers === null && (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                )}
                {teachers?.map((teacher) => {
                  const course = COURSES.find((c) => c.slug === teacher.courseSlug);
                  return (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {teacher.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {teacher.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {course?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {teacher.studentCount}
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
