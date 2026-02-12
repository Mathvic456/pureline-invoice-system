'use client';

import { useState, useEffect } from 'react';
import { Invoice } from '@/lib/types';
import { useInvoices } from '@/hooks/use-invoices';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { InvoiceList } from '@/components/invoice-list';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

export default function Page() {
  const { invoices, isLoaded, addInvoice, updateInvoice, deleteInvoice } =
    useInvoices();
  const [view, setView] = useState<'list' | 'form' | 'preview'>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setView('form');
  };

  const handleSubmit = (invoice: Invoice) => {
    if (selectedInvoice) {
      updateInvoice(selectedInvoice.id, invoice);
    } else {
      addInvoice(invoice);
    }
    setView('list');
    setSelectedInvoice(null);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedInvoice(null);
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setView('preview');
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm('Are you sure you want to delete this invoice?')
    ) {
      deleteInvoice(id);
    }
  };

  return (
    <main className="min-h-screen bg-background w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Invoice Manager</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Create, manage, and track your invoices
            </p>
          </div>
          {view === 'list' && (
            <Button onClick={handleCreateNew} className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          )}
        </div>

        {/* Content */}
        {view === 'list' && (
          <div>
            <InvoiceList
              invoices={invoices}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {view === 'form' && (
          <div className="w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              {selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <InvoiceForm
              initialInvoice={selectedInvoice}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {view === 'preview' && selectedInvoice && (
          <div className="w-full">
            <div className="mb-4 sm:mb-6">
              <Button
                variant="outline"
                onClick={() => setView('list')}
                className="w-full sm:w-auto"
              >
                Back to List
              </Button>
            </div>
            <InvoicePreview invoice={selectedInvoice} />
          </div>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }

          .no-print {
            display: none;
          }

          .container {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
