"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Note = { id: string; note: string; date: string };
type StudentDetail = {
  id: string;
  name: string;
  email: string;
  courseIds: string[];
  teacherId: string | null;
  level: string;
  progress: number;
  status: string;
  notes: Note[];
};
type Teacher = { id: string; name: string; courseIds: string[] };
type Course = { id: string; name: string };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminStudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null | undefined>(undefined);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/admin/students/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/teachers").then((r) => r.json()),
      fetch("/api/admin/courses").then((r) => r.json()),
    ]).then(([studentData, teachersData, coursesData]) => {
      if (!active) return;
      setStudent(studentData?.student ?? null);
      setTeachers(teachersData.teachers ?? []);
      setCourses(coursesData.courses ?? []);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (student === undefined) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (!student) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">Student not found.</p>
        <Link href="/admin/students" className="text-sm text-primary hover:underline">
          Back to Students
        </Link>
      </div>
    );
  }

  return <StudentEditor student={student} teachers={teachers} courses={courses} />;
}

function StudentEditor({
  student,
  teachers,
  courses,
}: {
  student: StudentDetail;
  teachers: Teacher[];
  courses: Course[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    courseIds: student.courseIds,
    teacherId: student.teacherId ?? "",
    level: student.level,
    progress: student.progress,
    status: student.status,
  });

  function toggleCourse(courseId: string) {
    setForm((f) => {
      const nextCourseIds = f.courseIds.includes(courseId)
        ? f.courseIds.filter((cid) => cid !== courseId)
        : [...f.courseIds, courseId];
      const teacherStillValid = teachers.some(
        (t) => t.id === f.teacherId && t.courseIds.some((cid) => nextCourseIds.includes(cid))
      );
      return {
        ...f,
        courseIds: nextCourseIds,
        teacherId: teacherStillValid ? f.teacherId : "",
      };
    });
  }

  const availableTeachers = teachers.filter((t) =>
    t.courseIds.some((cid) => form.courseIds.includes(cid))
  );

  const [notes, setNotes] = useState(student.notes);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timeout);
  }, [saved]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErrors({});
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSaved(true);
      } else {
        setErrors(data?.errors ?? { form: data?.error ?? "Something went wrong." });
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${student.name}? This will remove their notes, invoices, and notifications too. This can't be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/students");
        router.refresh();
      } else {
        setDeleting(false);
      }
    } catch {
      setDeleting(false);
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    const res = await fetch(`/api/admin/students/${student.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteText.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setNotes((prev) => [data.note, ...prev]);
      setNoteText("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/students"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to Students
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                {initials(student.name)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-foreground">
              {student.name}
            </h1>
          </div>
        </div>

        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          <Trash2 className="h-4 w-4" />
          {deleting ? "Deleting..." : "Delete Student"}
        </Button>
      </div>

      <Card className="max-w-2xl border-none bg-background shadow-none">
        <CardContent className="p-8">
          <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label>Courses</Label>
              <div className="flex flex-wrap gap-1.5">
                {courses.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5 text-sm has-checked:border-primary has-checked:bg-primary/10"
                  >
                    <input
                      type="checkbox"
                      checked={form.courseIds.includes(course.id)}
                      onChange={() => toggleCourse(course.id)}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    {course.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="teacher">Assigned Teacher</Label>
              <select
                id="teacher"
                value={form.teacherId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, teacherId: e.target.value }))
                }
                disabled={form.courseIds.length === 0}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              >
                <option value="">Unassigned</option>
                {availableTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {form.courseIds.length === 0
                  ? "Select a course to see teachers who teach it."
                  : availableTeachers.length === 0
                    ? "No teacher teaches these courses yet."
                    : "Only teachers of the selected courses are shown."}
              </p>
              {errors.teacherId && (
                <p className="text-xs text-destructive">{errors.teacherId}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Study Level</Label>
              <div className="flex gap-1.5">
                {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, level }))}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                      form.level === level
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {level.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <div className="flex gap-1.5">
                {["ACTIVE", "INACTIVE"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status }))}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                      form.status === status
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {status.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="progress">Progress</Label>
                <span className="text-xs font-medium text-muted-foreground">
                  {form.progress}%
                </span>
              </div>
              <input
                id="progress"
                type="range"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) =>
                  setForm((f) => ({ ...f, progress: Number(e.target.value) }))
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
              />
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${form.progress}%` }}
                />
              </div>
            </div>

            {errors.form && (
              <p className="text-xs text-destructive sm:col-span-2">{errors.form}</p>
            )}

            <div className="flex items-center gap-3 sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <span
                className={`flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity duration-300 ${
                  saved ? "opacity-100" : "opacity-0"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Saved
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-foreground">
          Progress Notes
        </h2>
        <Card className="mt-3 border-none bg-background shadow-none">
          <CardContent className="flex flex-col divide-y divide-border p-0">
            {notes.length === 0 && (
              <p className="px-6 py-4 text-sm text-muted-foreground">
                No notes yet.
              </p>
            )}
            {notes.map((note) => (
              <div key={note.id} className="px-6 py-4">
                <p className="text-sm text-foreground">{note.note}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(note.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
          <Input
            placeholder="Add a progress note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <Button type="submit" variant="outline">
            Add Note
          </Button>
        </form>
      </div>
    </div>
  );
}
