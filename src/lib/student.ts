export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export type Invoice = {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: InvoiceStatus;
};

export type Notification = {
  id: string;
  message: string;
  date: string;
};

export const STUDENT_PROFILE = {
  name: "Ali Raza",
  email: "ali.raza@example.com",
  phone: "+92 300 1234567",
  joined: "2026-05-10",
};

export const ENROLLMENTS = [
  {
    courseSlug: "quran-with-tajweed",
    progress: 65,
    nextClass: "2026-08-20 5:00 PM",
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "INV-1042",
    description: "Quran with Tajweed — August",
    amount: "PKR 5,000",
    date: "2026-08-01",
    status: "Paid",
  },
  {
    id: "INV-1051",
    description: "Quran with Tajweed — September",
    amount: "PKR 5,000",
    date: "2026-09-01",
    status: "Pending",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    message: "Your next class is scheduled for August 20, 5:00 PM.",
    date: "2026-08-15",
  },
  {
    id: "n2",
    message: "Invoice INV-1051 is due on September 1.",
    date: "2026-08-14",
  },
  {
    id: "n3",
    message: "Welcome to Global Teaching Hub! Your enrollment is confirmed.",
    date: "2026-08-10",
  },
];
