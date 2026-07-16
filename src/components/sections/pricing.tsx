import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Basic",
    price: "Rs. 2,999",
    cadence: "/month",
    tagline: "2 Classes/Week",
    features: ["Live Classes", "Doubt Support", "Weekly Progress Report"],
    highlighted: false,
    nameColor: "text-emerald-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    name: "Standard",
    price: "Rs. 4,999",
    cadence: "/month",
    tagline: "3 Classes/Week",
    features: ["Live Classes", "Doubt Support", "Weekly Progress Report"],
    highlighted: true,
    nameColor: "text-primary",
    buttonClass: "",
  },
  {
    name: "Premium",
    price: "Rs. 7,999",
    cadence: "/month",
    tagline: "Unlimited Classes",
    features: ["Live Classes", "Doubt Support", "Weekly Progress Report"],
    highlighted: false,
    nameColor: "text-violet-600",
    buttonClass: "bg-violet-600 hover:bg-violet-700",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Pricing Plans
          </h2>
          <p className="mt-3 text-muted-foreground">
            Affordable plans for every student.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.highlighted && "border-primary shadow-lg ring-1 ring-primary"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardContent
                className={cn(
                  "flex flex-1 flex-col gap-4 p-6",
                  plan.highlighted && "pt-10"
                )}
              >
                <p className={cn("text-lg font-bold", plan.nameColor)}>
                  {plan.name}
                </p>
                <div>
                  <span className="text-3xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.cadence}
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {plan.tagline}
                </p>
                <ul className="flex flex-1 flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/free-trial"
                  className={cn(buttonVariants(), "w-full", plan.buttonClass)}
                >
                  Get Started
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
