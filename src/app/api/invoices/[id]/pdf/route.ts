import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { notFound } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string }> };

type InvoiceForPdf = {
  invoiceNumber: string;
  description: string;
  amount: string;
  amountPaid: string | null;
  status: string;
  date: Date;
  dueDate: Date | null;
  student: { name: string; email: string };
};

function renderInvoicePdf(invoice: InvoiceForPdf): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).fillColor("#0f766e").text("Global Teaching Hub");
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor("#111827").text(`Invoice ${invoice.invoiceNumber}`);
    doc.moveDown();

    doc.fontSize(11).fillColor("#374151");
    doc.text(`Billed to: ${invoice.student.name} (${invoice.student.email})`);
    doc.text(`Description: ${invoice.description}`);
    doc.text(`Amount: ${invoice.amount}`);
    if (invoice.amountPaid) doc.text(`Amount Paid: ${invoice.amountPaid}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Date: ${invoice.date.toLocaleDateString()}`);
    if (invoice.dueDate) doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`);

    doc.end();
  });
}

// Deliberately unauthenticated: Twilio's WhatsApp media fetcher can't send
// custom auth headers, so the unguessable invoice id in the URL is the
// access token (same tradeoff most invoice-via-WhatsApp integrations make).
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { student: { select: { name: true, email: true } } },
  });
  if (!invoice) return notFound("Invoice not found.");

  const buffer = await renderInvoicePdf(invoice);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
