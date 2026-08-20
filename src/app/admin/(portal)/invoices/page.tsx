"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Receipt, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RowActionButton } from "@/components/dashboard/row-action-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Invoice = {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: string;
  amountPaid: string | null;
  dueDate: string | null;
  date: string;
  status: string;
  student: { id: string; name: string; email: string };
};

type Student = { id: string; name: string; email: string };

const STATUS_OPTIONS = ["PAID", "PENDING", "OVERDUE", "PARTIAL"] as const;

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  OVERDUE: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  PARTIAL: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

const EMPTY_FORM = {
  studentId: "",
  description: "",
  amount: "",
  dueDate: "",
  status: "PENDING" as (typeof STATUS_OPTIONS)[number],
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/invoices").then((r) => r.json()),
      fetch("/api/admin/students").then((r) => r.json()),
    ]).then(([invoicesData, studentsData]) => {
      if (!active) return;
      setInvoices(invoicesData.invoices ?? []);
      setStudents(studentsData.students ?? []);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!invoices) return null;
    const q = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      const matchesQuery =
        !q ||
        inv.student.name.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [invoices, query, statusFilter]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? { form: data.error ?? "Something went wrong." });
        return;
      }
      setInvoices((prev) => [data.invoice, ...(prev ?? [])]);
      setForm(EMPTY_FORM);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(invoice: Invoice, status: string) {
    setSavingId(invoice.id);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices((prev) =>
          prev?.map((inv) => (inv.id === invoice.id ? data.invoice : inv)) ?? prev
        );
      }
    } finally {
      setSavingId(null);
    }
  }

  async function handleAmountPaidBlur(invoice: Invoice, amountPaid: string) {
    if (amountPaid === (invoice.amountPaid ?? "")) return;
    setSavingId(invoice.id);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaid }),
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices((prev) =>
          prev?.map((inv) => (inv.id === invoice.id ? data.invoice : inv)) ?? prev
        );
      }
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(invoice: Invoice) {
    const confirmed = window.confirm(
      `Delete invoice ${invoice.invoiceNumber}? This can't be undone.`
    );
    if (!confirmed) return;

    setDeletingId(invoice.id);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices((prev) => prev?.filter((inv) => inv.id !== invoice.id) ?? prev);
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate and track student invoices and payment status.
          </p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create Invoice</SheetTitle>
            </SheetHeader>
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="studentId">Student</Label>
                <select
                  id="studentId"
                  required
                  value={form.studentId}
                  onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                >
                  <option value="">Select a student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p className="text-xs text-destructive">{errors.studentId}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  required
                  placeholder="e.g. Quran with Tajweed — September"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  required
                  placeholder="e.g. PKR 5,000"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
                {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
                {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as (typeof STATUS_OPTIONS)[number],
                    }))
                  }
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {errors.form && <p className="text-xs text-destructive">{errors.form}</p>}

              <div className="mt-auto flex gap-3 pt-2">
                <SheetClose
                  render={<Button type="button" variant="outline" className="flex-1" />}
                >
                  Cancel
                </SheetClose>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? "Saving..." : "Create Invoice"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student or invoice #..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["ALL", ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              {status.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-none bg-background shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-6 py-3 font-medium">Invoice #</th>
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Paid</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered === null &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-secondary/70" />
                      </td>
                    </tr>
                  ))}
                {filtered?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <Receipt className="mx-auto h-6 w-6 text-muted-foreground/50" />
                      <p className="mt-2 text-muted-foreground">No invoices match your search.</p>
                    </td>
                  </tr>
                )}
                {filtered?.map((invoice) => (
                  <tr key={invoice.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-medium text-foreground">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">{invoice.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{invoice.student.name}</p>
                      <p className="text-xs text-muted-foreground">{invoice.student.email}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <input
                        defaultValue={invoice.amountPaid ?? ""}
                        placeholder="—"
                        onBlur={(e) => handleAmountPaidBlur(invoice, e.target.value)}
                        disabled={savingId === invoice.id}
                        className="h-7 w-24 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30"
                      />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={invoice.status}
                        disabled={savingId === invoice.id}
                        onChange={(e) => handleStatusChange(invoice, e.target.value)}
                        className={`rounded-full border-none px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_STYLE[invoice.status]}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <RowActionButton
                          onClick={() => handleDelete(invoice)}
                          disabled={deletingId === invoice.id}
                          icon={Trash2}
                          label={`Delete invoice ${invoice.invoiceNumber}`}
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
