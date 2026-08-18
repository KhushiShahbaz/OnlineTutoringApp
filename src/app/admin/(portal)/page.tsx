"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Student = { progress: number; status: string };
type Teacher = { id: string };
type Course = { id: string };

export default function AdminOverviewPage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/students").then((r) => r.json()),
      fetch("/api/admin/teachers").then((r) => r.json()),
      fetch("/api/admin/courses").then((r) => r.json()),
    ]).then(([studentsData, teachersData, coursesData]) => {
      if (!active) return;
      setStudents(studentsData.students ?? []);
      setTeachers(teachersData.teachers ?? []);
      setCourses(coursesData.courses ?? []);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!students || !teachers || !courses) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A snapshot of students, teachers, and courses.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-none bg-background shadow-none">
              <CardContent className="p-6">
                <div className="h-7 w-12 animate-pulse rounded bg-secondary/70" />
                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-secondary/70" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const avgProgress = students.length
    ? Math.round(
        students.reduce((sum, s) => sum + s.progress, 0) / students.length
      )
    : 0;
  const activeCount = students.filter((s) => s.status === "ACTIVE").length;

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      href: "/admin/students",
      color: "text-teal-600 bg-teal-100",
    },
    {
      label: "Active Students",
      value: activeCount,
      icon: UserCheck,
      href: "/admin/students",
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Total Teachers",
      value: teachers.length,
      icon: GraduationCap,
      href: "/admin/teachers",
      color: "text-indigo-600 bg-indigo-100",
    },
    {
      label: "Courses Offered",
      value: courses.length,
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "Avg. Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      href: "/admin/students",
      color: "text-rose-600 bg-rose-100",
    },
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
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="block">
            <Card className="h-full border-none bg-background shadow-none transition hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
