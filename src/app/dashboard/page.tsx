"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCourseBySlug } from "@/lib/courses";

type Invoice = { id: string; description: string; amount: string; date: string; status: string };
type Notification = { id: string; message: string; date: string };
type StudentMe = {
  name: string;
  courseSlug: string | null;
  progress: number;
  invoices: Invoice[];
  notifications: Notification[];
} | null;

const STATUS_VARIANT = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
} as const;

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

  const course = student?.courseSlug ? getCourseBySlug(student.courseSlug) : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{student ? `, ${student.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your classes.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">
          My Enrollment
        </h2>
        {!course && (
          <p className="mt-3 text-sm text-muted-foreground">
            You&apos;re not enrolled in a course yet.
          </p>
        )}
        {course && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Card className="border-none bg-background shadow-none">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${course.color}`}
                  >
                    <course.icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {course.name}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{student?.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${student?.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Invoices
            </h2>
            <Link
              href="/dashboard/invoices"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <Card className="mt-3 border-none bg-background shadow-none">
            <CardContent className="flex flex-col divide-y divide-border p-0">
              {student?.invoices.length === 0 && (
                <p className="px-6 py-4 text-sm text-muted-foreground">
                  No invoices yet.
                </p>
              )}
              {student?.invoices.slice(0, 3).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {invoice.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.amount} ·{" "}
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      STATUS_VARIANT[invoice.status as keyof typeof STATUS_VARIANT]
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Notifications
          </h2>
          <Card className="mt-3 border-none bg-background shadow-none">
            <CardContent className="flex flex-col divide-y divide-border p-0">
              {student?.notifications.length === 0 && (
                <p className="px-6 py-4 text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              )}
              {student?.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 px-6 py-4"
                >
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm text-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
