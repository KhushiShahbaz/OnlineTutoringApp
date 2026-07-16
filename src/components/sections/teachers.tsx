import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TEACHERS = [
  { name: "Ayesha Khan", subject: "Mathematics", experience: "6+ Years Experience", rating: 4.9, reviews: 420 },
  { name: "Usman Ali", subject: "Physics", experience: "8+ Years Experience", rating: 4.9, reviews: 380 },
  { name: "Zainab Fatima", subject: "Quran (Tajweed)", experience: "5+ Years Experience", rating: 4.9, reviews: 310 },
  { name: "Hassan Raza", subject: "English", experience: "7+ Years Experience", rating: 4.8, reviews: 280 },
];

export function Teachers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Meet Our Teachers
        </h2>
        <p className="mt-3 text-muted-foreground">
          Learn from the best and most passionate teachers.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEACHERS.map((teacher) => (
          <Card key={teacher.name} className="text-center shadow-sm">
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
                  {teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{teacher.name}</p>
                <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {teacher.experience}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">
                  {teacher.rating}
                </span>
                <span className="text-muted-foreground">
                  ({teacher.reviews} reviews)
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Book a Class
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
