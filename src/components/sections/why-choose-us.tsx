import {
  Clock,
  FileText,
  Headphones,
  Monitor,
  ShieldCheck,
  Users,
  Video,
  Wallet,
} from "lucide-react";

const FEATURES = [
  { icon: Video, label: "Live Interactive Classes" },
  { icon: ShieldCheck, label: "Certified & Experienced Teachers" },
  { icon: Clock, label: "Flexible Timings" },
  { icon: FileText, label: "Recorded Lectures" },
  { icon: Monitor, label: "Weekly Progress Reports" },
  { icon: Wallet, label: "Affordable Fees" },
  { icon: Users, label: "One-to-One Learning" },
  { icon: Headphones, label: "24/7 Student Support" },
];

export function WhyChooseUs() {
  return (
    <section className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Why Choose Global Teaching Hub?
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
                <Icon className="h-6 w-6" />
              </span>
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
