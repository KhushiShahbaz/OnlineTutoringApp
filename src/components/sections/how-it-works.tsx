import { ClipboardCheck, GraduationCap, UserCheck, UserPlus } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your free account",
    color: "bg-emerald-500",
  },
  {
    icon: ClipboardCheck,
    title: "Book Free Demo",
    description: "Choose a subject and book your demo class",
    color: "bg-blue-500",
  },
  {
    icon: UserCheck,
    title: "Choose Your Teacher",
    description: "Select the perfect teacher for you",
    color: "bg-violet-500",
  },
  {
    icon: GraduationCap,
    title: "Start Learning",
    description: "Begin your classes and achieve your goals",
    color: "bg-orange-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-3 text-muted-foreground">
          Start your learning journey in just a few simple steps.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, description, color }, i) => (
          <div key={title} className="flex flex-col items-center text-center">
            <div className="relative">
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg ${color}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground shadow">
                {i + 1}
              </span>
            </div>
            <p className="mt-4 font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
