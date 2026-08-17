"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/dashboard/portal-shell";
import { useSession } from "@/lib/use-session";

const TEACHER_NAV: PortalNavItem[] = [
  { label: "Overview", href: "/teacher", icon: LayoutDashboard },
  { label: "My Students", href: "/teacher/students", icon: Users },
];

export default function TeacherPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSession();
  const loading = user === undefined;
  const authorized = user?.role === "TEACHER";

  useEffect(() => {
    if (!loading && !authorized) router.replace("/admin/login");
  }, [loading, authorized, router]);

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking access...
      </div>
    );
  }

  return (
    <PortalShell
      roleLabel="Teacher"
      navItems={TEACHER_NAV}
      onLogout={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
      }}
    >
      {children}
    </PortalShell>
  );
}
