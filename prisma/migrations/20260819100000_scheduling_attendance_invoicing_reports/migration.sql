-- AlterEnum: add PARTIAL payment status (not used within this migration, so safe to add)
ALTER TYPE "InvoiceStatus" ADD VALUE 'PARTIAL';

-- CreateEnum
CREATE TYPE "ClassDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GENERAL', 'INVOICE_GENERATED', 'PAYMENT_REMINDER', 'WEEKLY_REPORT', 'MONTHLY_REPORT', 'ATTENDANCE_ALERT');

-- AlterTable: Student profile, parent details, WhatsApp, class scheduling, monthly fee
ALTER TABLE "Student"
  ADD COLUMN "whatsapp" TEXT,
  ADD COLUMN "parentName" TEXT,
  ADD COLUMN "parentContact" TEXT,
  ADD COLUMN "classStartTime" TEXT,
  ADD COLUMN "classEndTime" TEXT,
  ADD COLUMN "classDays" "ClassDay"[] NOT NULL DEFAULT ARRAY[]::"ClassDay"[],
  ADD COLUMN "monthlyFee" TEXT;

-- AlterTable: Notification type, defaulting existing rows to GENERAL
ALTER TABLE "Notification" ADD COLUMN "type" "NotificationType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable: Invoice due date / partial-payment amount / invoice number (nullable first, backfilled below)
ALTER TABLE "Invoice"
  ADD COLUMN "invoiceNumber" TEXT,
  ADD COLUMN "amountPaid" TEXT,
  ADD COLUMN "dueDate" TIMESTAMP(3);

-- Backfill existing invoices with a sequential per-year invoice number
-- (INV-<year>-<0001>), ordered by original invoice date so numbering reads
-- chronologically.
WITH numbered AS (
  SELECT "id",
         EXTRACT(YEAR FROM "date")::int AS yr,
         ROW_NUMBER() OVER (PARTITION BY EXTRACT(YEAR FROM "date") ORDER BY "date" ASC, "id" ASC) AS rn
  FROM "Invoice"
)
UPDATE "Invoice" i
SET "invoiceNumber" = 'INV-' || numbered.yr || '-' || LPAD(numbered.rn::text, 4, '0')
FROM numbered
WHERE i."id" = numbered."id";

ALTER TABLE "Invoice" ALTER COLUMN "invoiceNumber" SET NOT NULL;
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateTable: Attendance
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "present" BOOLEAN NOT NULL,
    "lessonRemarks" TEXT,
    "homeworkRemarks" TEXT,
    "teacherComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON "Attendance"("studentId", "date");

ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: WeeklyReport
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "weekEnd" DATE NOT NULL,
    "presentCount" INTEGER NOT NULL,
    "totalCount" INTEGER NOT NULL,
    "topicsCovered" TEXT NOT NULL,
    "teacherRemarks" TEXT,
    "sentEmail" BOOLEAN NOT NULL DEFAULT false,
    "sentWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: MonthlyReport
CREATE TABLE "MonthlyReport" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "attendancePercent" DOUBLE PRECISION NOT NULL,
    "performanceSummary" TEXT NOT NULL,
    "teacherRemarks" TEXT,
    "sentEmail" BOOLEAN NOT NULL DEFAULT false,
    "sentWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MonthlyReport_studentId_month_year_key" ON "MonthlyReport"("studentId", "month", "year");

ALTER TABLE "MonthlyReport" ADD CONSTRAINT "MonthlyReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
