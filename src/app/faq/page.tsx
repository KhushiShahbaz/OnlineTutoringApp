import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQs — Global Teaching Hub",
  description: "Frequently asked questions about Global Teaching Hub.",
};

const FAQS = [
  {
    question: "How do the online classes work?",
    answer:
      "Classes are conducted live, one-to-one, over video call with a dedicated teacher. Sessions are scheduled at a time that works for you, and recordings are shared afterward so you can revisit any lesson.",
  },
  {
    question: "Which courses do you currently offer?",
    answer:
      "We currently offer Quran with Tajweed (including Translation and Tafseer) and Computer Courses (MS Word, PowerPoint, and Programming Languages). More courses will be added soon.",
  },
  {
    question: "How do I book a free demo class?",
    answer:
      "Click “Book a Free Demo” on the homepage, fill in your details and preferred course, and our team will contact you to schedule your free trial class.",
  },
  {
    question: "What do I need to attend a class?",
    answer:
      "A stable internet connection and a laptop, tablet, or smartphone with a camera and microphone are all you need to join a class.",
  },
  {
    question: "How can I get in touch with support?",
    answer:
      "You can reach us anytime through the Contact page, or via the phone number and email listed in the footer.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about learning with EduSphere
              Academy.
            </p>
          </div>

          <Accordion className="mt-10">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <Footer />
    </>
  );
}
