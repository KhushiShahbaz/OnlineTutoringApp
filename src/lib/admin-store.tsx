"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_STUDENTS,
  SEED_TEACHERS,
  type ProgressNote,
  type Student,
  type Teacher,
} from "@/lib/admin-data";

const STORAGE_KEY = "learninghub-admin-data";

type NewStudentInput = Omit<Student, "id" | "notes">;
type NewTeacherInput = Omit<Teacher, "id">;

type AdminDataContextValue = {
  students: Student[];
  teachers: Teacher[];
  addStudent: (input: NewStudentInput) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  addProgressNote: (studentId: string, note: string) => void;
  addTeacher: (input: NewTeacherInput) => void;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(SEED_TEACHERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time upgrade from seed data to persisted localStorage data after
    // mount, so the server-rendered/hydration-matching pass stays seed-only.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          students?: Student[];
          teachers?: Teacher[];
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.students) setStudents(parsed.students);
        if (parsed.teachers) setTeachers(parsed.teachers);
      }
    } catch {
      // ignore malformed local data, fall back to seed
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ students, teachers }));
  }, [students, teachers, hydrated]);

  function addStudent(input: NewStudentInput) {
    const student: Student = { ...input, id: `s-${Date.now()}`, notes: [] };
    setStudents((prev) => [...prev, student]);
  }

  function updateStudent(id: string, updates: Partial<Student>) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }

  function addProgressNote(studentId: string, note: string) {
    const entry: ProgressNote = {
      id: `n-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      note,
    };
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, notes: [...s.notes, entry] } : s
      )
    );
  }

  function addTeacher(input: NewTeacherInput) {
    const teacher: Teacher = { ...input, id: `t-${Date.now()}` };
    setTeachers((prev) => [...prev, teacher]);
  }

  return (
    <AdminDataContext.Provider
      value={{
        students,
        teachers,
        addStudent,
        updateStudent,
        addProgressNote,
        addTeacher,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return ctx;
}
