"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminData } from "@/lib/admin-store";
import { getStaffSession } from "@/lib/staff-session";
import type { Student, StudentLevel } from "@/lib/admin-data";

export default function TeacherStudentProgressPage() {
  const { id } = useParams<{ id: string }>();
  const session = getStaffSession();
  const teacherId = session?.role === "teacher" ? session.teacherId : null;
  const { students } = useAdminData();

  const student = students.find(
    (s) => s.id === id && s.teacherId === teacherId
  );

  if (!student) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">
          Student not found, or not assigned to you.
        </p>
        <Link
          href="/teacher/students"
          className="text-sm text-primary hover:underline"
        >
          Back to My Students
        </Link>
      </div>
    );
  }

  return <ProgressEditor key={student.id} student={student} />;
}

function ProgressEditor({ student }: { student: Student }) {
  const { updateStudent, addProgressNote } = useAdminData();
  const [level, setLevel] = useState<StudentLevel>(student.level);
  const [progress, setProgress] = useState(student.progress);
  const [noteText, setNoteText] = useState("");

  function handleSave(e: FormEvent) {
    e.preventDefault();
    updateStudent(student.id, { level, progress });
  }

  function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    addProgressNote(student.id, noteText.trim());
    setNoteText("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/teacher/students"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to My Students
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          {student.name}
        </h1>
        <p className="text-sm text-muted-foreground">{student.email}</p>
      </div>

      <Card className="max-w-lg border-none bg-background shadow-none">
        <CardContent className="p-8">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="level">Study Level</Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as StudentLevel)}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
              />
            </div>

            <Button type="submit" className="self-start">
              Save Progress
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-lg">
        <h2 className="text-sm font-semibold text-foreground">
          Progress Notes
        </h2>
        <Card className="mt-3 border-none bg-background shadow-none">
          <CardContent className="flex flex-col divide-y divide-border p-0">
            {student.notes.length === 0 && (
              <p className="px-6 py-4 text-sm text-muted-foreground">
                No notes yet.
              </p>
            )}
            {student.notes.map((note) => (
              <div key={note.id} className="px-6 py-4">
                <p className="text-sm text-foreground">{note.note}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {note.date}
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
