import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FreeTrialForm } from "@/components/sections/free-trial-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Book a Free Demo — Global Teaching Hub",
  description: "Book a free demo class with Global Teaching Hub.",
};

export default async function FreeTrialPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    select: { name: true },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Book a Free Demo
            </h1>
            <p className="mt-3 text-muted-foreground">
              Fill in your details and our team will schedule your free demo
              class.
            </p>
          </div>

          <div className="mt-12">
            <FreeTrialForm courses={courses.map((c) => c.name)} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
