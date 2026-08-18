"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Student = {
  id: string;
  name: string;
  email: string;
  level: string;
  progress: number;
  status: string;
};

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/teacher/students")
      .then((r) => r.json())
      .then((data) => {
        if (active) setStudents(data.students ?? []);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update study level and progress for your students.
        </p>
      </div>

      <Card className="border-none bg-background shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Level</th>
                  <th className="px-6 py-3 font-medium">Progress</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students === null && (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                )}
                {students?.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-muted-foreground"
                    >
                      No students assigned yet.
                    </td>
                  </tr>
                )}
                {students?.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {student.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {student.level}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {student.progress}%
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={student.status === "ACTIVE" ? "default" : "outline"}
                      >
                        {student.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/teacher/students/${student.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Update Progress
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
