"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
  Wifi,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Student = { progress: number; status: string };
type Teacher = { id: string };
type Course = { id: string };
type TeamMember = { id: string; name: string; role: string; online: boolean };

export default function AdminOverviewPage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [attendanceToday, setAttendanceToday] = useState<
    { presentCount: number; totalCount: number } | null
  >(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/students").then((r) => r.json()),
      fetch("/api/admin/teachers").then((r) => r.json()),
      fetch("/api/admin/courses").then((r) => r.json()),
      fetch("/api/admin/presence").then((r) => r.json()),
      fetch("/api/admin/attendance/today").then((r) => r.json()),
    ]).then(([studentsData, teachersData, coursesData, presenceData, attendanceData]) => {
      if (!active) return;
      setStudents(studentsData.students ?? []);
      setTeachers(teachersData.teachers ?? []);
      setCourses(coursesData.courses ?? []);
      setTeam(presenceData.team ?? []);
      setAttendanceToday(attendanceData);
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
      color: "text-teal-600 bg-teal-100 dark:text-teal-300 dark:bg-teal-500/15",
    },
    {
      label: "Active Students",
      value: activeCount,
      icon: UserCheck,
      href: "/admin/students",
      color: "text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/15",
    },
    {
      label: "Total Teachers",
      value: teachers.length,
      icon: GraduationCap,
      href: "/admin/teachers",
      color: "text-indigo-600 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-500/15",
    },
    {
      label: "Courses Offered",
      value: courses.length,
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/15",
    },
    {
      label: "Avg. Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      href: "/admin/students",
      color: "text-rose-600 bg-rose-100 dark:text-rose-300 dark:bg-rose-500/15",
    },
  ];

  const onlineCount = team?.filter((t) => t.online).length ?? 0;
  const teamTotal = team?.length ?? 0;
  const onlineNames = team?.filter((t) => t.online).map((t) => t.name) ?? [];

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

      <div>
        <h2 className="text-sm font-semibold text-foreground">Live Today</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Card className="border-none bg-background shadow-none">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Wifi className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Team Online Now</p>
                {team === null ? (
                  <div className="mt-2 h-5 w-16 animate-pulse rounded bg-secondary/70" />
                ) : (
                  <>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {onlineCount}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / {teamTotal}
                      </span>
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {onlineNames.length > 0
                        ? onlineNames.join(", ")
                        : "No one is online right now."}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-background shadow-none">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Today&apos;s Attendance</p>
                {attendanceToday === null ? (
                  <div className="mt-2 h-5 w-16 animate-pulse rounded bg-secondary/70" />
                ) : attendanceToday.totalCount === 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No classes marked today yet.
                  </p>
                ) : (
                  <>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {attendanceToday.presentCount}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / {attendanceToday.totalCount} present
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {Math.round(
                        (attendanceToday.presentCount / attendanceToday.totalCount) * 100
                      )}
                      % attendance rate so far today
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
