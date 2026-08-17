"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TESTIMONIALS = [
  {
    quote:
      "Global Teaching Hub has helped me improve my grades and build confidence. The teachers are amazing and classes are very interactive.",
    name: "Mahnoor Ali",
    role: "Student",
  },
  {
    quote:
      "The Quran with Tajweed classes are excellent. My recitation has improved so much, and the teachers are patient and encouraging.",
    name: "Hassan Raza",
    role: "Student",
  },
  {
    quote:
      "I learned MS Office and the basics of programming through the computer courses. Flexible timings made it easy to balance with school.",
    name: "Areeba Khan",
    role: "Student",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section id="testimonials" className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          What Our Students Say
        </h2>

        <div className="relative mt-10 px-0 sm:px-12">
          <Carousel setApi={setApi} opts={{ loop: true }}>
            <CarouselContent>
              {TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.name}>
                  <Card className="border-none shadow-md">
                    <CardContent className="flex flex-col items-center gap-5 p-8 sm:p-10">
                      <Quote className="h-8 w-8 text-primary/30" />
                      <p className="text-lg text-foreground">
                        &ldquo;{testimonial.quote}&rdquo;
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
                            {initials(testimonial.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:inline-flex" />
            <CarouselNext className="hidden sm:inline-flex" />
          </Carousel>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((testimonial, i) => (
            <button
              key={testimonial.name}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === current ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
