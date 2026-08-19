import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, TrendingUp, Video } from "lucide-react";
import { LoginForm } from "@/components/sections/login-form";

export const metadata: Metadata = {
  title: "Login — Global Teaching Hub",
  description: "Login to your Global Teaching Hub student account.",
};

const FEATURES = [
  {
    icon: Video,
    title: "Live one-to-one classes",
    description: "Real teachers, real time — not pre-recorded videos.",
  },
  {
    icon: Clock,
    title: "Flexible scheduling",
    description: "Book classes around your routine, not the other way around.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    description: "See your enrollments, invoices, and growth in one place.",
  },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Marketing panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-teal-700 via-teal-600 to-emerald-700 p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2 font-bold">
          <Image
            src="/logo-icon.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-base">Global Teaching Hub</span>
        </Link>

        <div className="relative">
          <h1 className="text-4xl leading-tight font-extrabold">
            Pick up right where{" "}
            <span className="text-emerald-200">you left off.</span>
          </h1>
          <p className="mt-4 max-w-sm text-teal-50/90">
            Live one-to-one classes, expert teachers, and a dashboard built
            around your progress.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-sm text-teal-50/80">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-teal-50/60">
          © {new Date().getFullYear()} Global Teaching Hub. All Rights
          Reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 font-bold lg:hidden"
          >
            <Image
              src="/logo-icon.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-base text-foreground">
              Global Teaching Hub
            </span>
          </Link>

          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Login to access your student dashboard.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
