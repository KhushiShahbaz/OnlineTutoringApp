"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function PortalShell({
  roleLabel,
  navItems,
  onLogout,
  children,
}: {
  roleLabel: string;
  navItems: PortalNavItem[];
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-secondary/20">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/60 bg-background px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-base text-foreground">Global Teaching Hub</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {roleLabel}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 sm:block">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
