import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Global Teaching Hub",
  description: "Get in touch with Global Teaching Hub.",
};

const CONTACT_DETAILS = [
  { icon: Phone, label: "+92 319 5459398" },
  { icon: Mail, label: "globalteachinghub1@gmail.com" },
  { icon: MapPin, label: "Lahore, Pakistan" },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-3 text-muted-foreground">
              Have a question? Send us a message and our team will get back
              to you.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
            {CONTACT_DETAILS.map(({ icon: Icon, label }) => (
              <Card
                key={label}
                className="border-none bg-secondary/40 shadow-none"
              >
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-lg">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
