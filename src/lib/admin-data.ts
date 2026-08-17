export type StudentLevel = "Beginner" | "Intermediate" | "Advanced";
export type StudentStatus = "Active" | "Inactive";

export type ProgressNote = {
  id: string;
  date: string;
  note: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  courseSlug: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  courseSlug: string;
  teacherId: string | null;
  level: StudentLevel;
  progress: number;
  status: StudentStatus;
  joined: string;
  notes: ProgressNote[];
};

export const SEED_TEACHERS: Teacher[] = [
  {
    id: "t-1",
    name: "Hafsa Siddiqui",
    email: "hafsa.siddiqui@edusphereacademy.com",
    courseSlug: "quran-with-tajweed",
  },
  {
    id: "t-2",
    name: "Bilal Ahmed",
    email: "bilal.ahmed@edusphereacademy.com",
    courseSlug: "computer-courses",
  },
];

export const SEED_STUDENTS: Student[] = [
  {
    id: "s-1",
    name: "Ali Raza",
    email: "ali.raza@example.com",
    courseSlug: "quran-with-tajweed",
    teacherId: "t-1",
    level: "Intermediate",
    progress: 65,
    status: "Active",
    joined: "2026-05-10",
    notes: [
      { id: "n-1", date: "2026-08-10", note: "Enrollment confirmed." },
      {
        id: "n-2",
        date: "2026-08-14",
        note: "Good progress on Tajweed rules this week.",
      },
    ],
  },
  {
    id: "s-2",
    name: "Mahnoor Ali",
    email: "mahnoor.ali@example.com",
    courseSlug: "quran-with-tajweed",
    teacherId: "t-1",
    level: "Beginner",
    progress: 30,
    status: "Active",
    joined: "2026-06-02",
    notes: [],
  },
  {
    id: "s-3",
    name: "Hassan Raza",
    email: "hassan.raza@example.com",
    courseSlug: "computer-courses",
    teacherId: "t-2",
    level: "Advanced",
    progress: 85,
    status: "Active",
    joined: "2026-04-20",
    notes: [
      { id: "n-3", date: "2026-08-01", note: "Completed MS Word module." },
    ],
  },
  {
    id: "s-4",
    name: "Areeba Khan",
    email: "areeba.khan@example.com",
    courseSlug: "computer-courses",
    teacherId: null,
    level: "Beginner",
    progress: 10,
    status: "Inactive",
    joined: "2026-08-05",
    notes: [],
  },
];
