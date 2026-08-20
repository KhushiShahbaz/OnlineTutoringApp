"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Receipt, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getIconComponent } from "@/lib/course-icons";
import { ProgressRing } from "@/components/dashboard/progress-ring";

type Invoice = { id: string; description: string; amount: string; date: string; status: string };
type Notification = { id: string; message: string; date: string };
type AttendanceEntry = { id: string; date: string; present: boolean };
type CourseSummary = {
  id: string;
  slug: string;
  name: string;
  color: string;
  icon: string;
  classStartTime: string | null;
  classEndTime: string | null;
  classDays: string[];
  attendance: AttendanceEntry[];
};
type StudentMe = {
  name: string;
  courses: CourseSummary[];
  progress: number;
  invoices: Invoice[];
  notifications: Notification[];
} | null;

const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

function scheduleLine(course: CourseSummary) {
  if (course.classDays.length === 0 || !course.classStartTime || !course.classEndTime) {
    return null;
  }
  const days = course.classDays.map((d) => DAY_SHORT[d]).join(" & ");
  return `${days}, ${formatTime(course.classStartTime)} – ${formatTime(course.classEndTime)}`;
}

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  OVERDUE: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  PARTIAL: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentMe | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetch("/api/student/me")
      .then((r) => r.json())
      .then((data) => {
        if (active) setStudent(data.student);
      });
    return () => {
      active = false;
    };
  }, []);

  if (student === undefined) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  const firstName = student?.name.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-700 via-teal-600 to-emerald-700 p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-20 -right-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-teal-50">
              <Sparkles className="h-3.5 w-3.5" />
              Keep it up!
            </span>
            <h1 className="mt-3 text-3xl font-bold">
              Welcome back{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="mt-2 max-w-md text-sm text-teal-50/90">
              Here&apos;s what&apos;s happening with your classes today.
            </p>
          </div>
          {student && student.courses.length > 0 && (
            <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
              <ProgressRing value={student.progress} />
              <div>
                <p className="text-sm font-semibold text-white">
                  Overall progress
                </p>
                <p className="text-xs text-teal-50/80">
                  Across {student.courses.length}{" "}
                  {student.courses.length === 1 ? "course" : "courses"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground">
          My Enrollments
        </h2>
        {(!student || student.courses.length === 0) && (
          <Card className="mt-3 border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                You&apos;re not enrolled in a course yet.
              </p>
            </CardContent>
          </Card>
        )}
        {student && student.courses.length > 0 && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {student.courses.map((course) => {
              const Icon = getIconComponent(course.icon);
              const schedule = scheduleLine(course);
              const recentAttendance = [...course.attendance].reverse();
              return (
                <Card
                  key={course.id}
                  className="group overflow-hidden border-none shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${course.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {course.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {schedule ?? "Schedule not set yet"}
                        </p>
                      </div>
                    </div>
                    {recentAttendance.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {recentAttendance.map((entry) => (
                          <span
                            key={entry.id}
                            title={new Date(entry.date).toLocaleDateString()}
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              entry.present
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                            }`}
                          >
                            {new Date(entry.date).toLocaleDateString(undefined, {
                              weekday: "short",
                            })}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Recent Invoices
            </h2>
            <Link
              href="/dashboard/invoices"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {student?.invoices.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No invoices yet.
                </CardContent>
              </Card>
            )}
            {student?.invoices.slice(0, 3).map((invoice) => (
              <Card key={invoice.id} className="border-none shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <Receipt className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {invoice.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.amount} ·{" "}
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[invoice.status] ?? "bg-secondary text-muted-foreground"}`}
                  >
                    {invoice.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Notifications
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {student?.notifications.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </CardContent>
              </Card>
            )}
            {student?.notifications.map((notification) => (
              <Card key={notification.id} className="border-none shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bell className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
