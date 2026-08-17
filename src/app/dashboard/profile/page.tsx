import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { STUDENT_PROFILE } from "@/lib/student";

export const metadata: Metadata = {
  title: "Profile — Global Teaching Hub",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and update your personal information.
        </p>
      </div>

      <Card className="max-w-lg border-none bg-background shadow-none">
        <CardContent className="p-8">
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={STUDENT_PROFILE.name} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={STUDENT_PROFILE.email}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={STUDENT_PROFILE.phone} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="joined">Student Since</Label>
              <Input
                id="joined"
                name="joined"
                defaultValue={STUDENT_PROFILE.joined}
                disabled
              />
            </div>

            <Button type="submit" size="lg" className="mt-2 self-start">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
