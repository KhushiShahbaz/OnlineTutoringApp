-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "summary" TEXT NOT NULL,
    "topics" TEXT[],
    "color" TEXT NOT NULL DEFAULT 'text-teal-600 bg-teal-100',
    "icon" TEXT NOT NULL DEFAULT 'BookOpen',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- Seed the two existing courses so the data below can be backfilled by slug.
-- (Matches prisma/seed.ts; running the seed script afterward will upsert
-- these same rows without creating duplicates.)
INSERT INTO "Course" ("id", "slug", "name", "description", "summary", "topics", "color", "icon")
VALUES
  (
    'cl_quran_with_tajweed',
    'quran-with-tajweed',
    'Quran with Tajweed',
    'Tajweed, Translation, Tafseer',
    'Learn to recite the Quran with correct Tajweed rules, understand its meaning through Translation, and deepen your understanding with Tafseer — taught one-to-one by experienced, qualified teachers.',
    ARRAY['Tajweed', 'Translation', 'Tafseer'],
    'text-teal-600 bg-teal-100',
    'Landmark'
  ),
  (
    'cl_computer_courses',
    'computer-courses',
    'Computer Courses',
    'MS Word, PowerPoint, Programming Languages',
    'Build practical computer skills from the ground up — from everyday office tools like MS Word and PowerPoint to the fundamentals of programming languages.',
    ARRAY['MS Word', 'PowerPoint', 'Programming Languages'],
    'text-indigo-600 bg-indigo-100',
    'Monitor'
  );

-- AlterTable: add Teacher.courseId as nullable first so we can backfill it
ALTER TABLE "Teacher" ADD COLUMN "courseId" TEXT;

UPDATE "Teacher" t
SET "courseId" = c."id"
FROM "Course" c
WHERE c."slug" = t."courseSlug";

-- Any teacher whose old courseSlug didn't match a known course falls back
-- to the first course, so the column can be made required.
UPDATE "Teacher"
SET "courseId" = (SELECT "id" FROM "Course" ORDER BY "createdAt" LIMIT 1)
WHERE "courseId" IS NULL;

ALTER TABLE "Teacher" ALTER COLUMN "courseId" SET NOT NULL;
ALTER TABLE "Teacher" DROP COLUMN "courseSlug";

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: implicit many-to-many join table for Student <-> Course
CREATE TABLE "_CourseToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "_CourseToStudent_B_index" ON "_CourseToStudent"("B");

ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill enrollments from the old single Student.courseSlug column.
INSERT INTO "_CourseToStudent" ("A", "B")
SELECT c."id", s."id"
FROM "Student" s
JOIN "Course" c ON c."slug" = s."courseSlug"
WHERE s."courseSlug" IS NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "courseSlug";
