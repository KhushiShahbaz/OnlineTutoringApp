import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, CalendarCheck, Users2 } from "lucide-react";
import { RegisterForm } from "@/components/sections/register-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sign Up — Global Teaching Hub",
  description: "Create your Global Teaching Hub student account.",
};

// Course list is admin-managed and must always reflect live data, not a
// snapshot frozen at build time.
export const dynamic = "force-dynamic";

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Book your first free demo",
    description: "Try a live class before you commit to anything.",
  },
  {
    icon: Users2,
    title: "Learn one-to-one",
    description: "Every class is just you and your teacher, no crowd.",
  },
  {
    icon: Award,
    title: "Join students worldwide",
    description: "Thousands of students already learning with us.",
  },
];

export default async function RegisterPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

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
            Start learning, <span className="text-emerald-200">today.</span>
          </h1>
          <p className="mt-4 max-w-sm text-teal-50/90">
            Create your free account and book your first live class in
            minutes.
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
        <div className="w-full max-w-md">
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

          <h2 className="text-2xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign up to book classes and track your learning journey.
          </p>

          <div className="mt-8">
            <RegisterForm courses={courses} />
          </div>
        </div>
      </div>
    </main>
  );
}
