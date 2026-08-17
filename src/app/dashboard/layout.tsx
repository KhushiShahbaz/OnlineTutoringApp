"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, User } from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/dashboard/portal-shell";
import { useSession } from "@/lib/use-session";

const STUDENT_NAV: PortalNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
];

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
    <PortalShell
      roleLabel="Student"
      navItems={STUDENT_NAV}
      onLogout={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
      }}
    >
      {children}
    </PortalShell>
  );
}
