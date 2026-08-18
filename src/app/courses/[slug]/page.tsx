import type { Metadata } from "next";
import { createElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getIconComponent } from "@/lib/course-icons";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });

  if (!course) return {};

  return {
    title: `${course.name} — Global Teaching Hub`,
    description: course.summary,
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });

  if (!course) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <span
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${course.color}`}
            >
              {createElement(getIconComponent(course.icon), { className: "h-8 w-8" })}
            </span>
            <h1 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              {course.name}
            </h1>
            <p className="mt-4 text-muted-foreground">{course.summary}</p>
          </div>

          {course.topics.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-foreground">
                What You&apos;ll Learn
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {course.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-center gap-3 rounded-lg bg-secondary/40 px-4 py-3"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {topic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-3">
            <Link href="/free-trial" className={buttonVariants({ size: "lg" })}>
              Book a Free Demo
            </Link>
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to all courses
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
