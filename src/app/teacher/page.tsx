"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseBySlug } from "@/lib/courses";

type TeacherInfo = { name: string; courseSlug: string };
type Student = { progress: number };

export default function TeacherOverviewPage() {
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const [students, setStudents] = useState<Student[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/teacher/students")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setTeacher(data.teacher ?? null);
        setStudents(data.students ?? []);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!students) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  const avgProgress = students.length
    ? Math.round(
        students.reduce((sum, s) => sum + s.progress, 0) / students.length
      )
    : 0;
  const course = teacher ? getCourseBySlug(teacher.courseSlug) : undefined;

  const stats = [
    { label: "My Students", value: students.length },
    { label: "Avg. Progress", value: `${avgProgress}%` },
    { label: "Course", value: course?.name ?? "—" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {teacher?.name ?? "Teacher"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your students.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none bg-background shadow-none">
            <CardContent className="p-6">
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
