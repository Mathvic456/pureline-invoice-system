'use client';

import { Invoice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

export function InvoiceList({
  invoices,
  onView,
  onEdit,
  onDelete,
}: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <Card className="p-6 sm:p-12 text-center">
        <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">No invoices yet</p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Create your first invoice to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b bg-muted">
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">
                Invoice #
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Client</th>
              <th className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
              <th className="hidden md:table-cell px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">
                Due Date
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold">Total</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const total = invoice.items.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice,
                0
              ) + invoice.transportCost + invoice.labourCost;
              return (
                <tr key={invoice.id} className="border-b hover:bg-muted/50">
                  <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm truncate">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm truncate">{invoice.clientName}</td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{invoice.date}</td>
                  <td className="hidden md:table-cell px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{invoice.dueDate}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-right font-medium text-xs sm:text-sm">
                    ₦{total.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex justify-center gap-1 sm:gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(invoice)}
                        title="View"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Eye className="h-3 sm:h-4 w-3 sm:w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(invoice)}
                        title="Edit"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Edit className="h-3 sm:h-4 w-3 sm:w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(invoice.id)}
                        title="Delete"
                        className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 sm:h-4 w-3 sm:w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
