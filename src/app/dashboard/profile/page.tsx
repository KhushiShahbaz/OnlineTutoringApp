"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type StudentMe = {
  name: string;
  email: string;
  phone: string | null;
  joined: string;
} | null;

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentMe | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetch("/api/student/me")
      .then((r) => r.json())
      .then((data) => {
        if (active) setStudent(data.student);
      });
    return () => {
      active = false;
    };
  }, []);

  if (student === undefined) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (!student) {
    return (
      <p className="text-sm text-muted-foreground">
        Your student profile hasn&apos;t been set up yet.
      </p>
    );
  }

  return <ProfileForm student={student} />;
}

function ProfileForm({ student }: { student: NonNullable<StudentMe> }) {
  const [name, setName] = useState(student.name);
  const [phone, setPhone] = useState(student.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/student/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.errors?.name ?? "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

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
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={student.email} disabled />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="joined">Student Since</Label>
              <Input
                id="joined"
                name="joined"
                defaultValue={new Date(student.joined).toLocaleDateString()}
                disabled
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center gap-3">
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {saved && <p className="text-xs text-muted-foreground">Saved.</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
