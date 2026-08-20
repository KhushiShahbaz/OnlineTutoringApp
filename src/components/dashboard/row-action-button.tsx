import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  view: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25",
  edit: "bg-violet-100 text-violet-600 hover:bg-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/25",
  danger: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25",
  neutral: "bg-secondary text-muted-foreground hover:bg-secondary/70",
} as const;

type Variant = keyof typeof VARIANT_STYLES;

const baseClass =
  "flex h-8 w-8 items-center justify-center rounded-full transition-colors";

export function RowActionLink({
  href,
  icon: Icon,
  label,
  variant = "view",
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: Variant;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(baseClass, VARIANT_STYLES[variant])}
    >
      <Icon className="h-3.5 w-3.5" />
    </Link>
  );
}

export function RowActionButton({
  onClick,
  icon: Icon,
  label,
  variant = "view",
  disabled,
}: {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  variant?: Variant;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(baseClass, VARIANT_STYLES[variant], "disabled:opacity-50")}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
