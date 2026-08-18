import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getIconComponent } from "@/lib/course-icons";

export const metadata: Metadata = {
  title: "Courses — Global Teaching Hub",
  description: "Explore the courses offered by Global Teaching Hub.",
};

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Our Courses
            </h1>
            <p className="mt-3 text-muted-foreground">
              Explore our current course offerings and start your learning
              journey today.
            </p>
          </div>

          {courses.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">
              No courses are available right now — check back soon.
            </p>
          )}

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {courses.map(({ slug, icon, name, color, description }) => {
              const Icon = getIconComponent(icon);
              return (
                <Link key={slug} href={`/courses/${slug}`} className="block">
                  <Card className="h-full border-none bg-secondary/40 shadow-none transition hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
                      >
                        <Icon className="h-7 w-7" />
                      </span>
                      <p className="text-lg font-semibold text-foreground">
                        {name}
                      </p>
                      {description && (
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/contact" className={buttonVariants({ size: "lg" })}>
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
