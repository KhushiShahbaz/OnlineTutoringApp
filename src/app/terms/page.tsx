import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — Global Teaching Hub",
  description: "Terms and Conditions for Global Teaching Hub.",
};

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By enrolling in a course or using our website, you agree to these Terms & Conditions. If you do not agree, please do not use our services.",
  },
  {
    title: "Enrollment & Classes",
    body: "Class schedules are arranged based on mutual availability between students and teachers. We ask that students provide reasonable notice if a scheduled class needs to be rescheduled or cancelled.",
  },
  {
    title: "Free Demo Classes",
    body: "Free demo classes are offered to help you evaluate our teaching before enrolling. They are subject to teacher availability and may be limited to one per student.",
  },
  {
    title: "Fees & Payments",
    body: "Course fees, where applicable, will be communicated to you directly by our team before enrollment is confirmed.",
  },
  {
    title: "Code of Conduct",
    body: "Students and teachers are expected to treat one another with respect during classes. Global Teaching Hub reserves the right to suspend access for behavior that violates this expectation.",
  },
  {
    title: "Changes to These Terms",
    body: "We may update these Terms & Conditions from time to time. Continued use of our services after changes are posted constitutes acceptance of the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: August 2026
          </p>

          <div className="mt-10 flex flex-col gap-8">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
