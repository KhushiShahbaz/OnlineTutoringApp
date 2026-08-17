import type { Metadata } from "next";
import Link from "next/link";
import { Target, Users2, Eye } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us — Global Teaching Hub",
  description: "Learn about Global Teaching Hub's mission and story.",
};

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    body: "To make quality, personalized education accessible to students everywhere, through live one-to-one classes with experienced, caring teachers.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "To become a trusted online academy where students from Pakistan and around the world can learn, grow, and achieve their goals with confidence.",
  },
  {
    icon: Users2,
    title: "Our Teachers",
    body: "Every class is led by a qualified, experienced teacher who is committed to your progress, with flexible scheduling built around your life.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            About Global Teaching Hub
          </h1>
          <p className="mt-4 text-muted-foreground">
            Global Teaching Hub is an online tutoring platform offering live,
            one-to-one classes, experienced teachers, flexible schedules, and
            personalized learning for students from Pakistan and around the
            world.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border-none bg-secondary/40 shadow-none">
                <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-base font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <WhyChooseUs />

        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to start learning?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Book a free demo class and experience Global Teaching Hub for
            yourself.
          </p>
          <Link
            href="/free-trial"
            className={buttonVariants({ size: "lg", className: "mt-6" })}
          >
            Book a Free Demo
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
