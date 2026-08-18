-- CreateTable: implicit many-to-many join table for Teacher <-> Course
CREATE TABLE "_CourseToTeacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToTeacher_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "_CourseToTeacher_B_index" ON "_CourseToTeacher"("B");

ALTER TABLE "_CourseToTeacher" ADD CONSTRAINT "_CourseToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CourseToTeacher" ADD CONSTRAINT "_CourseToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill each teacher's existing single course into the new join table.
INSERT INTO "_CourseToTeacher" ("A", "B")
SELECT "courseId", "id" FROM "Teacher" WHERE "courseId" IS NOT NULL;

-- Drop the old single-course column now that it's been migrated.
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_courseId_fkey";
ALTER TABLE "Teacher" DROP COLUMN "courseId";
