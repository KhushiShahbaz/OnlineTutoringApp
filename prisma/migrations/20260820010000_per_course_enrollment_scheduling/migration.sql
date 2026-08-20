CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateTable: Enrollment (Student <-> Course, with its own class schedule)
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "classStartTime" TEXT,
    "classEndTime" TEXT,
    "classDays" "ClassDay"[] NOT NULL DEFAULT ARRAY[]::"ClassDay"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- Backfill enrollments from the old implicit Student<->Course join table,
-- carrying each student's single former schedule onto every course they
-- take (admin can differentiate per course afterward).
INSERT INTO "Enrollment" ("id", "studentId", "courseId", "classStartTime", "classEndTime", "classDays", "createdAt")
SELECT gen_random_uuid()::text, cs."B", cs."A", s."classStartTime", s."classEndTime", s."classDays", CURRENT_TIMESTAMP
FROM "_CourseToStudent" cs
JOIN "Student" s ON s."id" = cs."B";

CREATE UNIQUE INDEX "Enrollment_studentId_courseId_key" ON "Enrollment"("studentId", "courseId");

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate Attendance to reference Enrollment instead of Student directly.
-- Where a student has multiple enrollments, existing attendance (which
-- predates per-course tracking) is attached to their earliest enrollment.
ALTER TABLE "Attendance" ADD COLUMN "enrollmentId" TEXT;

UPDATE "Attendance" a
SET "enrollmentId" = (
  SELECT e."id" FROM "Enrollment" e
  WHERE e."studentId" = a."studentId"
  ORDER BY e."createdAt" ASC
  LIMIT 1
);

DELETE FROM "Attendance" WHERE "enrollmentId" IS NULL;

ALTER TABLE "Attendance" ALTER COLUMN "enrollmentId" SET NOT NULL;
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";
DROP INDEX "Attendance_studentId_date_key";
ALTER TABLE "Attendance" DROP COLUMN "studentId";
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "Attendance_enrollmentId_date_key" ON "Attendance"("enrollmentId", "date");

-- Migrate WeeklyReport to reference Enrollment instead of Student directly.
ALTER TABLE "WeeklyReport" ADD COLUMN "enrollmentId" TEXT;

UPDATE "WeeklyReport" w
SET "enrollmentId" = (
  SELECT e."id" FROM "Enrollment" e
  WHERE e."studentId" = w."studentId"
  ORDER BY e."createdAt" ASC
  LIMIT 1
);

DELETE FROM "WeeklyReport" WHERE "enrollmentId" IS NULL;

ALTER TABLE "WeeklyReport" ALTER COLUMN "enrollmentId" SET NOT NULL;
ALTER TABLE "WeeklyReport" DROP CONSTRAINT "WeeklyReport_studentId_fkey";
ALTER TABLE "WeeklyReport" DROP COLUMN "studentId";
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate MonthlyReport to reference Enrollment instead of Student directly.
ALTER TABLE "MonthlyReport" ADD COLUMN "enrollmentId" TEXT;

UPDATE "MonthlyReport" m
SET "enrollmentId" = (
  SELECT e."id" FROM "Enrollment" e
  WHERE e."studentId" = m."studentId"
  ORDER BY e."createdAt" ASC
  LIMIT 1
);

DELETE FROM "MonthlyReport" WHERE "enrollmentId" IS NULL;

ALTER TABLE "MonthlyReport" ALTER COLUMN "enrollmentId" SET NOT NULL;
ALTER TABLE "MonthlyReport" DROP CONSTRAINT "MonthlyReport_studentId_fkey";
DROP INDEX "MonthlyReport_studentId_month_year_key";
ALTER TABLE "MonthlyReport" DROP COLUMN "studentId";
ALTER TABLE "MonthlyReport" ADD CONSTRAINT "MonthlyReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "MonthlyReport_enrollmentId_month_year_key" ON "MonthlyReport"("enrollmentId", "month", "year");

-- Drop now-redundant per-student schedule fields (moved to Enrollment).
ALTER TABLE "Student" DROP COLUMN "classStartTime";
ALTER TABLE "Student" DROP COLUMN "classEndTime";
ALTER TABLE "Student" DROP COLUMN "classDays";

-- Drop the old implicit Student<->Course join table, replaced by Enrollment.
DROP TABLE "_CourseToStudent";
