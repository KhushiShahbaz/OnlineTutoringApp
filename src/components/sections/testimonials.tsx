import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "EduSphere Academy has helped me improve my grades and build confidence. The teachers are amazing and classes are very interactive.",
    name: "Mahnoor Ali",
    role: "Student",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          What Our Students Say
        </h2>

        <Card className="mt-10 border-none shadow-md">
          <CardContent className="flex flex-col items-center gap-5 p-8 sm:p-10">
            <Quote className="h-8 w-8 text-primary/30" />
            <p className="text-lg text-foreground">
              &ldquo;{TESTIMONIALS[0].quote}&rdquo;
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                  MA
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  {TESTIMONIALS[0].name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {TESTIMONIALS[0].role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === 0 ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
