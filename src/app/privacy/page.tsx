import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Global Teaching Hub",
  description: "Privacy Policy for Global Teaching Hub.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "When you book a free demo, contact us, or enroll in a course, we collect information such as your name, email address, phone number, and the course you're interested in. We only collect what's needed to provide and improve our services.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to schedule classes, respond to your inquiries, send you relevant updates about your enrollment, and improve the quality of our teaching and support.",
  },
  {
    title: "Information Sharing",
    body: "We do not sell or rent your personal information to third parties. Your details are only shared with Global Teaching Hub staff and teachers directly involved in your learning experience.",
  },
  {
    title: "Data Security",
    body: "We take reasonable measures to protect your personal information from unauthorized access, alteration, or disclosure.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal information at any time by contacting us.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Privacy Policy
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
