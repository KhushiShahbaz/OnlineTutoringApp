"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudentShell } from "@/components/dashboard/student-shell";
import { useSession } from "@/lib/use-session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSession();
  const loading = user === undefined;
  const authorized = user?.role === "STUDENT";

  useEffect(() => {
    if (!loading && !authorized) router.replace("/login");
  }, [loading, authorized, router]);

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking access...
      </div>
    );
  }

  return (
    <StudentShell
      name={user.name}
      onLogout={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
      }}
    >
      {children}
    </StudentShell>
  );
}
