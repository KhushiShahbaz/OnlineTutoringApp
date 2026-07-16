import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Globe2,
  BookMarked,
  Landmark,
  MessageCircle,
  Award,
  ClipboardList,
  Monitor,
  PenTool,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const COURSES = [
  { icon: BookOpen, name: "Matric", color: "text-emerald-600 bg-emerald-100" },
  { icon: FlaskConical, name: "FSc", color: "text-blue-600 bg-blue-100" },
  { icon: Globe2, name: "O Levels", color: "text-violet-600 bg-violet-100" },
  { icon: BookMarked, name: "A Levels", color: "text-rose-600 bg-rose-100" },
  { icon: Landmark, name: "Quran with Tajweed", color: "text-teal-600 bg-teal-100" },
  { icon: MessageCircle, name: "Spoken English", color: "text-orange-600 bg-orange-100" },
  { icon: Award, name: "IELTS", color: "text-red-600 bg-red-100" },
  { icon: ClipboardList, name: "SAT", color: "text-sky-600 bg-sky-100" },
  { icon: Monitor, name: "Computer Courses", color: "text-indigo-600 bg-indigo-100" },
  { icon: PenTool, name: "Graphic Designing", color: "text-amber-600 bg-amber-100" },
];

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

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {COURSES.map(({ icon: Icon, name, color }) => (
          <Card
            key={name}
            className="border-none bg-secondary/40 shadow-none transition hover:-translate-y-1 hover:shadow-md"
          >
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold text-foreground">{name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/courses" className={buttonVariants({ size: "lg" })}>
          View All Courses
        </Link>
      </div>
    </section>
  );
}
