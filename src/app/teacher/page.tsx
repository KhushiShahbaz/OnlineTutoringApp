"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAdminData } from "@/lib/admin-store";
import { getCourseBySlug } from "@/lib/courses";
import { getStaffSession } from "@/lib/staff-session";

export default function TeacherOverviewPage() {
  const session = getStaffSession();
  const teacherId = session?.role === "teacher" ? session.teacherId : null;
  const { students, teachers } = useAdminData();

  const teacher = teachers.find((t) => t.id === teacherId);
  const myStudents = students.filter((s) => s.teacherId === teacherId);
  const avgProgress = myStudents.length
    ? Math.round(
        myStudents.reduce((sum, s) => sum + s.progress, 0) /
          myStudents.length
      )
    : 0;
  const course = teacher ? getCourseBySlug(teacher.courseSlug) : undefined;

  const stats = [
    { label: "My Students", value: myStudents.length },
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
