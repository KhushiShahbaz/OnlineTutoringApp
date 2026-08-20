import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { requireString, type FieldErrors } from "@/lib/validation";
import { createInvoiceForStudent } from "@/lib/invoices";

const VALID_STATUSES = ["PAID", "PENDING", "OVERDUE", "PARTIAL"] as const;

export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  const invoices = await prisma.invoice.findMany({
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ invoices });
}

export async function POST(request: Request) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const errors: FieldErrors = {};

  const studentId = requireString(errors, "studentId", data.studentId, "Student");
  const description = requireString(errors, "description", data.description, "Description", {
    min: 2,
    max: 200,
  });
  const amount = requireString(errors, "amount", data.amount, "Amount", { min: 1, max: 50 });
  const status = typeof data.status === "string" ? data.status : "PENDING";
  if (!(VALID_STATUSES as readonly string[]).includes(status)) {
    errors.status = "Select a valid status.";
  }

  const dueDate =
    typeof data.dueDate === "string" && data.dueDate ? new Date(data.dueDate) : null;
  if (dueDate && Number.isNaN(dueDate.getTime())) {
    errors.dueDate = "Enter a valid due date.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const invoice = await createInvoiceForStudent({
    studentId,
    description,
    amount,
    dueDate,
    status: status as (typeof VALID_STATUSES)[number],
  });
  if (!invoice) {
    return NextResponse.json({ errors: { studentId: "Select a valid student." } }, { status: 422 });
  }

  return NextResponse.json({ invoice });
}
