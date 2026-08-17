import { Landmark, type LucideIcon, Monitor } from "lucide-react";

export type Course = {
  slug: string;
  icon: LucideIcon;
  name: string;
  color: string;
  description?: string;
  summary: string;
  topics: string[];
};

export const COURSES: Course[] = [
  {
    slug: "quran-with-tajweed",
    icon: Landmark,
    name: "Quran with Tajweed",
    color: "text-teal-600 bg-teal-100",
    description: "Tajweed, Translation, Tafseer",
    summary:
      "Learn to recite the Quran with correct Tajweed rules, understand its meaning through Translation, and deepen your understanding with Tafseer — taught one-to-one by experienced, qualified teachers.",
    topics: ["Tajweed", "Translation", "Tafseer"],
  },
  {
    slug: "computer-courses",
    icon: Monitor,
    name: "Computer Courses",
    color: "text-indigo-600 bg-indigo-100",
    description: "MS Word, PowerPoint, Programming Languages",
    summary:
      "Build practical computer skills from the ground up — from everyday office tools like MS Word and PowerPoint to the fundamentals of programming languages.",
    topics: ["MS Word", "PowerPoint", "Programming Languages"],
  },
];

export function getCourseBySlug(slug: string) {
  return COURSES.find((course) => course.slug === slug);
}
