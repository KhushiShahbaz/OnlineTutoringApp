"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type WeeklyReport = {
  id: string;
  weekStart: string;
  weekEnd: string;
  presentCount: number;
  totalCount: number;
  topicsCovered: string;
  teacherRemarks: string | null;
  courseName: string;
};

export type MonthlyReport = {
  id: string;
  month: number;
  year: number;
  attendancePercent: number;
  performanceSummary: string;
  teacherRemarks: string | null;
  courseName: string;
};

export type EnrollmentOption = { id: string; courseName: string };

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function mondayOfCurrentWeek() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  return monday.toISOString().slice(0, 10);
}

export function ReportsPanel({
  apiBase,
  enrollments,
  initialWeekly,
  initialMonthly,
}: {
  /** e.g. `/api/admin/students/${id}` or `/api/teacher/students/${id}` */
  apiBase: string;
  enrollments: EnrollmentOption[];
  initialWeekly: WeeklyReport[];
  initialMonthly: MonthlyReport[];
}) {
  const [weekly, setWeekly] = useState(initialWeekly);
  const [monthly, setMonthly] = useState(initialMonthly);
  const [enrollmentId, setEnrollmentId] = useState(enrollments[0]?.id ?? "");
  const [generating, setGenerating] = useState<"weekly" | "monthly" | null>(null);

  async function handleGenerateWeekly() {
    if (!enrollmentId) return;
    setGenerating("weekly");
    try {
      const res = await fetch(`${apiBase}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "weekly",
          enrollmentId,
          weekStart: mondayOfCurrentWeek(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWeekly((prev) => [
          data.weeklyReport,
          ...prev.filter((r) => r.id !== data.weeklyReport.id),
        ]);
      }
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenerateMonthly() {
    if (!enrollmentId) return;
    setGenerating("monthly");
    const now = new Date();
    try {
      const res = await fetch(`${apiBase}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "monthly",
          enrollmentId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMonthly((prev) => [
          data.monthlyReport,
          ...prev.filter((r) => r.id !== data.monthlyReport.id),
        ]);
      }
    } finally {
      setGenerating(null);
    }
  }

  if (enrollments.length === 0) {
    return (
      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-foreground">Reports</h2>
        <Card className="mt-3 border-none bg-background shadow-none">
          <CardContent className="px-6 py-4 text-sm text-muted-foreground">
            Enroll this student in a course first to generate reports.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">Reports</h2>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="report-course">Course</Label>
            <select
              id="report-course"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {enrollments.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.courseName}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateWeekly}
            disabled={generating !== null}
          >
            {generating === "weekly" ? "Generating..." : "Generate Weekly Report"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateMonthly}
            disabled={generating !== null}
          >
            {generating === "monthly" ? "Generating..." : "Generate Monthly Report"}
          </Button>
        </div>
      </div>

      {weekly.length === 0 && monthly.length === 0 && (
        <Card className="mt-3 border-none bg-background shadow-none">
          <CardContent className="px-6 py-4 text-sm text-muted-foreground">
            No reports generated yet.
          </CardContent>
        </Card>
      )}

      {weekly.length > 0 && (
        <Card className="mt-3 border-none bg-background shadow-none">
          <CardContent className="flex flex-col divide-y divide-border p-0">
            {weekly.map((r) => (
              <div key={r.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {r.courseName} — Week of {new Date(r.weekStart).toLocaleDateString()}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {r.presentCount}/{r.totalCount} present
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Topics: {r.topicsCovered}
                </p>
                {r.teacherRemarks && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Remarks: {r.teacherRemarks}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {monthly.length > 0 && (
        <Card className="mt-3 border-none bg-background shadow-none">
          <CardContent className="flex flex-col divide-y divide-border p-0">
            {monthly.map((r) => (
              <div key={r.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {r.courseName} — {MONTH_NAMES[r.month - 1]} {r.year}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {r.attendancePercent}% attendance
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.performanceSummary}
                </p>
                {r.teacherRemarks && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Remarks: {r.teacherRemarks}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
