import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  const adminPassword = await hash("Admin@12345");
  await prisma.user.upsert({
    where: { email: "admin@edusphereacademy.com" },
    update: {},
    create: {
      name: "Site Admin",
      email: "admin@edusphereacademy.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const teacherPassword = await hash("Teacher@12345");

  const hafsa = await prisma.user.upsert({
    where: { email: "hafsa.siddiqui@edusphereacademy.com" },
    update: {},
    create: {
      name: "Hafsa Siddiqui",
      email: "hafsa.siddiqui@edusphereacademy.com",
      passwordHash: teacherPassword,
      role: "TEACHER",
      teacher: { create: { courseSlug: "quran-with-tajweed" } },
    },
    include: { teacher: true },
  });

  const bilal = await prisma.user.upsert({
    where: { email: "bilal.ahmed@edusphereacademy.com" },
    update: {},
    create: {
      name: "Bilal Ahmed",
      email: "bilal.ahmed@edusphereacademy.com",
      passwordHash: teacherPassword,
      role: "TEACHER",
      teacher: { create: { courseSlug: "computer-courses" } },
    },
    include: { teacher: true },
  });

  const hafsaTeacherId = hafsa.teacher!.id;
  const bilalTeacherId = bilal.teacher!.id;

  const studentPassword = await hash("Student@12345");

  const aliUser = await prisma.user.upsert({
    where: { email: "ali.raza@example.com" },
    update: {},
    create: {
      name: "Ali Raza",
      email: "ali.raza@example.com",
      passwordHash: studentPassword,
      role: "STUDENT",
      student: {
        create: {
          name: "Ali Raza",
          email: "ali.raza@example.com",
          phone: "+92 300 1234567",
          courseSlug: "quran-with-tajweed",
          teacherId: hafsaTeacherId,
          level: "INTERMEDIATE",
          progress: 65,
          status: "ACTIVE",
          notes: {
            create: [
              { note: "Enrollment confirmed." },
              { note: "Good progress on Tajweed rules this week." },
            ],
          },
          invoices: {
            create: [
              {
                description: "Quran with Tajweed — August",
                amount: "PKR 5,000",
                status: "PAID",
              },
              {
                description: "Quran with Tajweed — September",
                amount: "PKR 5,000",
                status: "PENDING",
              },
            ],
          },
          notifications: {
            create: [
              { message: "Your next class is scheduled for August 20, 5:00 PM." },
              { message: "Invoice for September is due on September 1." },
              { message: "Welcome to EduSphere Academy! Your enrollment is confirmed." },
            ],
          },
        },
      },
    },
  });

  await prisma.student.upsert({
    where: { email: "mahnoor.ali@example.com" },
    update: {},
    create: {
      name: "Mahnoor Ali",
      email: "mahnoor.ali@example.com",
      courseSlug: "quran-with-tajweed",
      teacherId: hafsaTeacherId,
      level: "BEGINNER",
      progress: 30,
      status: "ACTIVE",
    },
  });

  await prisma.student.upsert({
    where: { email: "hassan.raza@example.com" },
    update: {},
    create: {
      name: "Hassan Raza",
      email: "hassan.raza@example.com",
      courseSlug: "computer-courses",
      teacherId: bilalTeacherId,
      level: "ADVANCED",
      progress: 85,
      status: "ACTIVE",
      notes: { create: [{ note: "Completed MS Word module." }] },
    },
  });

  await prisma.student.upsert({
    where: { email: "areeba.khan@example.com" },
    update: {},
    create: {
      name: "Areeba Khan",
      email: "areeba.khan@example.com",
      courseSlug: "computer-courses",
      teacherId: null,
      level: "BEGINNER",
      progress: 10,
      status: "INACTIVE",
    },
  });

  console.log("Seed complete.");
  console.log("Admin login:   admin@edusphereacademy.com / Admin@12345");
  console.log("Teacher login: hafsa.siddiqui@edusphereacademy.com / Teacher@12345");
  console.log("Teacher login: bilal.ahmed@edusphereacademy.com / Teacher@12345");
  console.log("Student login: ali.raza@example.com / Student@12345 (userId:", aliUser.id, ")");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
