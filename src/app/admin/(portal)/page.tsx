"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { COURSES } from "@/lib/courses";

type Student = { progress: number; status: string };
type Teacher = { id: string };

export default function AdminOverviewPage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);

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

  if (!students || !teachers) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  const avgProgress = students.length
    ? Math.round(
        students.reduce((sum, s) => sum + s.progress, 0) / students.length
      )
    : 0;
  const activeCount = students.filter((s) => s.status === "ACTIVE").length;

  const stats = [
    { label: "Total Students", value: students.length },
    { label: "Active Students", value: activeCount },
    { label: "Total Teachers", value: teachers.length },
    { label: "Courses Offered", value: COURSES.length },
    { label: "Avg. Progress", value: `${avgProgress}%` },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of students, teachers, and courses.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
