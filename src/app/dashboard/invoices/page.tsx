import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INVOICES } from "@/lib/student";

export const metadata: Metadata = {
  title: "Invoices — Global Teaching Hub",
};

const STATUS_VARIANT = {
  Paid: "default",
  Pending: "outline",
  Overdue: "destructive",
} as const;

export default function InvoicesPage() {
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
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INVOICES.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={STATUS_VARIANT[invoice.status]}>
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
