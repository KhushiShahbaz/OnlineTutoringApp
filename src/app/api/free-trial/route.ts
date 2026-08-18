import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import {
  requireEmail,
  requirePhone,
  requireString,
  type FieldErrors,
} from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = requireString(errors, "name", data.name, "Full name", {
    min: 2,
    max: 100,
  });
  const phone = requirePhone(errors, "phone", data.phone);
  const email = requireEmail(errors, "email", data.email);
  const course = requireString(errors, "course", data.course, "Course", {
    min: 1,
    max: 100,
  });

  if (course) {
    const match = await prisma.course.findFirst({ where: { name: course } });
    if (!match) errors.course = "Select a valid course.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  try {
    await sendNotificationEmail({
      type: "demo",
      subject: `🎓 New Free Demo Request — ${course} — ${name}`,
      replyTo: email,
      lines: [
        { label: "Name", value: name },
        { label: "Phone / WhatsApp", value: phone },
        { label: "Email", value: email },
        { label: "Course", value: course },
      ],
    });
  } catch (error) {
    console.error("Failed to send free trial email", error);
    return NextResponse.json(
      { error: "Something went wrong sending your request. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
