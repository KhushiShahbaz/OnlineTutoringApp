"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Invoice = {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: string;
};

const STATUS_VARIANT = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
} as const;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/student/me")
      .then((r) => r.json())
      .then((data) => {
        if (active) setInvoices(data.student?.invoices ?? []);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your billing history and payment status.
        </p>
      </div>

      <Card className="border-none bg-background shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices === null && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                )}
                {invoices?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-muted-foreground">
                      No invoices yet.
                    </td>
                  </tr>
                )}
                {invoices?.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 text-muted-foreground">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          STATUS_VARIANT[invoice.status as keyof typeof STATUS_VARIANT]
                        }
                      >
                        {invoice.status}
                      </Badge>
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
