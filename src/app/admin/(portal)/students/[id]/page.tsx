"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURSES } from "@/lib/courses";

type Note = { id: string; note: string; date: string };
type StudentDetail = {
  id: string;
  name: string;
  email: string;
  courseSlug: string | null;
  teacherId: string | null;
  level: string;
  progress: number;
  status: string;
  notes: Note[];
};
type Teacher = { id: string; name: string };

export default function AdminStudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null | undefined>(undefined);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/admin/students/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/teachers").then((r) => r.json()),
    ]).then(([studentData, teachersData]) => {
      if (!active) return;
      setStudent(studentData?.student ?? null);
      setTeachers(teachersData.teachers ?? []);
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

  return <StudentEditor student={student} teachers={teachers} />;
}

function StudentEditor({
  student,
  teachers,
}: {
  student: StudentDetail;
  teachers: Teacher[];
}) {
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    courseSlug: student.courseSlug ?? "",
    teacherId: student.teacherId ?? "",
    level: student.level,
    progress: student.progress,
    status: student.status,
  });
  const [notes, setNotes] = useState(student.notes);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
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
      <div>
        <Link
          href="/admin/students"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to Students
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          {student.name}
        </h1>
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
              <Label htmlFor="teacher">Assigned Teacher</Label>
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) =>
                  setForm((f) => ({ ...f, progress: Number(e.target.value) }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="flex items-end gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {saved && (
                <p className="text-xs text-muted-foreground">Saved.</p>
              )}
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
