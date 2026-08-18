"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/use-session";

export type PortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
  const user = useSession();

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-background sm:flex">
        <Link href="/" className="flex items-center gap-2 px-5 py-5 font-bold">
          <Image
            src="/logo-icon.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-sm text-foreground">Global Teaching Hub</span>
            <span className="text-xs font-medium text-muted-foreground">
              {roleLabel} Portal
            </span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          <p className="px-2.5 pt-2 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Main Menu
          </p>
          {navItems.map(({ label, href, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {!!badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/60 bg-background px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold sm:hidden">
            <Image
              src="/logo-icon.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </Link>

          <div className="hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full py-1 pr-1 pl-3">
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.name ?? "..."}
                </p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {user ? initials(user.name) : ""}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
