import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCourseBySlug } from "@/lib/courses";
import {
  ENROLLMENTS,
  INVOICES,
  NOTIFICATIONS,
  STUDENT_PROFILE,
} from "@/lib/student";

export const metadata: Metadata = {
  title: "Dashboard — Global Teaching Hub",
};

const STATUS_VARIANT = {
  Paid: "default",
  Pending: "outline",
  Overdue: "destructive",
} as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {STUDENT_PROFILE.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your classes.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">
          My Enrollments
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {ENROLLMENTS.map((enrollment) => {
            const course = getCourseBySlug(enrollment.courseSlug);
            if (!course) return null;
            const Icon = course.icon;

            return (
              <Card
                key={enrollment.courseSlug}
                className="border-none bg-background shadow-none"
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${course.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {course.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Next class: {enrollment.nextClass}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
              {INVOICES.slice(0, 3).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {invoice.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.amount} · {invoice.date}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[invoice.status]}>
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
              {NOTIFICATIONS.map((notification) => (
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
                      {notification.date}
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
