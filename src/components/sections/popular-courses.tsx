import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { COURSES } from "@/lib/courses";

export function PopularCourses() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Popular Courses
        </h2>
        <p className="mt-3 text-muted-foreground">
          Choose from a wide range of courses and start your learning journey
          today.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-8">
        {COURSES.map(({ slug, icon: Icon, name, color, description }) => (
            <Card className="w-40 border-none bg-secondary/40 shadow-none transition hover:-translate-y-1 hover:shadow-md sm:w-60">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                {description && (
                  <p className="text-xs text-muted-foreground">
                    {description}
                  </p>
                )}
              </CardContent>
            </Card>
        ))}
      </div>
    </section>
  );
}
