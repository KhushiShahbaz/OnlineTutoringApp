import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/mailer";
import {
  requireEmail,
  requireString,
  type FieldErrors,
} from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = requireString(
    errors,
    "name",
    data.name,
    "Full name",
    {
      min: 2,
      max: 100,
    }
  );

  const email = requireEmail(
    errors,
    "email",
    data.email
  );

  const subject = requireString(
    errors,
    "subject",
    data.subject,
    "Subject",
    {
      min: 2,
      max: 150,
    }
  );

  const message = requireString(
    errors,
    "message",
    data.message,
    "Message",
    {
      min: 10,
      max: 3000,
    }
  );

  // Validation errors
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { errors },
      { status: 422 }
    );
  }

  try {
    await sendNotificationEmail({
      type: "contact",
      subject: `📩 New Contact Message — ${subject} — ${name}`,
      replyTo: email,
      lines: [
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Subject", value: subject },
        { label: "Message", value: message },
      ],
    });
  } catch (error) {
    console.error(
      "Failed to send contact form email",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong sending your message. Please try again later.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
  });
}