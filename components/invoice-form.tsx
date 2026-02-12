'use client';

import React from "react"

import { useState } from 'react';
import { Invoice, InvoiceItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface InvoiceFormProps {
  initialInvoice?: Invoice | null;
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
}

export function InvoiceForm({
  initialInvoice,
  onSubmit,
  onCancel,
}: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Invoice>(
    initialInvoice || {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      companyName: 'Pureline Designs',
      companyEmail: 'purelinedesignss@gmail.com',
      companyPhone: '+2349016781147',
      companyAddress: 'Blue Zodiac Plaza, G.U.Ake Road, Eliozu, Port Harcourt',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
      transportCost: 0,
      labourCost: 0,
      notes: '',
      createdAt: new Date().toISOString(),
    }
  );

  const handleAddItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        {
          id: Math.random().toString(36).substr(2, 9),
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    });
  };

  const handleRemoveItem = (id: string) => {
    setInvoice({
      ...invoice,
      items: invoice.items.filter((item) => item.id !== id),
    });
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleChange = (
    field: keyof Omit<Invoice, 'items'>,
    value: string
  ) => {
    setInvoice({ ...invoice, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Company Section */}
        <Card className="p-4 sm:p-6">
          <h3 className="mb-4 font-semibold text-foreground">Company Information</h3>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-md space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Company Name</p>
                <p className="text-sm font-semibold text-foreground">Pureline Designs</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-semibold text-foreground">purelinedesignss@gmail.com</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-semibold text-foreground">+2349016781147</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-semibold text-foreground">Blue Zodiac Plaza, G.U.Ake Road, Eliozu, Port Harcourt</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Invoice Details */}
        <Card className="p-4 sm:p-6">
          <h3 className="mb-4 font-semibold text-foreground">Invoice Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={invoice.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoice.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                required
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Client Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-foreground">Bill To</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={invoice.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={invoice.clientEmail}
              onChange={(e) => handleChange('clientEmail', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Phone</Label>
            <Input
              id="clientPhone"
              value={invoice.clientPhone}
              onChange={(e) => handleChange('clientPhone', e.target.value)}
              placeholder="+234..."
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="clientAddress">Address</Label>
            <Textarea
              id="clientAddress"
              value={invoice.clientAddress}
              onChange={(e) => handleChange('clientAddress', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Items Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-foreground">Line Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">
                  Unit Price
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => {
                const amount = item.quantity * item.unitPrice;
                return (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id, 'description', e.target.value)
                        }
                        placeholder="Item description"
                        className="border-0 p-0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            'quantity',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="0"
                        step="0.01"
                        className="border-0 p-0 text-right"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            'unitPrice',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="0"
                        step="0.01"
                        className="border-0 p-0 text-right"
                      />
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      ₦{amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Button
          type="button"
          onClick={handleAddItem}
          variant="outline"
          className="mt-4 gap-2 bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </Card>

      {/* Additional Costs Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-foreground">Additional Costs</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="transportCost">Transport Cost (₦)</Label>
            <Input
              id="transportCost"
              type="number"
              value={invoice.transportCost}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  transportCost: parseFloat(e.target.value) || 0,
                })
              }
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="labourCost">Labour Cost (₦)</Label>
            <Input
              id="labourCost"
              type="number"
              value={invoice.labourCost}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  labourCost: parseFloat(e.target.value) || 0,
                })
              }
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </Card>

      {/* Notes Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-foreground">Notes</h3>
        <Textarea
          value={invoice.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add any notes or terms..."
          rows={4}
        />
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">Save Invoice</Button>
      </div>
    </form>
  );
}
