'use client';

import { Invoice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const subtotalWithCosts = subtotal + invoice.transportCost + invoice.labourCost;
  const taxe = subtotalWithCosts // 7.5% tax
  const tax = subtotalWithCosts * 0.075; // 7.5% tax
  const total = subtotalWithCosts;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end no-print">
        <Button onClick={handlePrint} variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button onClick={handleDownloadPDF} className="gap-2 w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div
        ref={contentRef}
        className="border bg-white p-6 sm:p-8 md:p-12 text-foreground space-y-4 sm:space-y-6 overflow-x-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 border-b pb-4 sm:pb-6">
          <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
            <img 
              src="/pureline.png" 
              alt="Pureline Designs Logo"
              className="h-25 sm:h-16 w-12 sm:w-16 object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">{invoice.companyName}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{invoice.companyEmail}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{invoice.companyPhone}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">
                {invoice.companyAddress}
              </p>
            </div>
          </div>
          <div className="text-right w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">QUOTATION</h2>
            <div className="mt-2 sm:mt-4 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
              <p>
                <span className="font-semibold">Invoice #:</span> <span className="break-all">{invoice.invoiceNumber}</span>
              </p>
              <p>
                <span className="font-semibold">Date:</span> {invoice.date}
              </p>
              <p>
                <span className="font-semibold">Due Date:</span> {invoice.dueDate}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div>
            <h3 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground mb-2 sm:mb-3">
              Bill To
            </h3>
            <p className="font-semibold text-sm sm:text-base break-words">{invoice.clientName}</p>
            {invoice.clientEmail && (
              <p className="text-xs sm:text-sm text-muted-foreground break-all">{invoice.clientEmail}</p>
            )}
            {invoice.clientPhone && (
              <p className="text-xs sm:text-sm text-muted-foreground break-all">{invoice.clientPhone}</p>
            )}
            {invoice.clientAddress && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 whitespace-pre-wrap break-words">
                {invoice.clientAddress}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto -mx-6 sm:-mx-8 md:-mx-12">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-t-2 border-b-2 border-foreground">
                <th className="text-left py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Description</th>
                <th className="text-right py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Qty</th>
                <th className="text-right py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Unit Price</th>
                <th className="text-right py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-muted">
                  <td className="py-3 px-4 text-xs sm:text-sm">{item.description}</td>
                  <td className="text-right py-3 px-4 text-xs sm:text-sm">{item.quantity}</td>
                  <td className="text-right py-3 px-4 text-xs sm:text-sm">₦{item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-3 px-4 font-medium text-xs sm:text-sm">
                    ₦{(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-96 space-y-2 border-t pt-3 sm:pt-4">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Subtotal (Items):</span>
              <span className="font-medium">₦{subtotal.toFixed(2)}</span>
            </div>
            {invoice.transportCost > 0 && (
              <div className="flex justify-between text-sm sm:text-base">
                <span>Transport Cost:</span>
                <span className="font-medium">₦{invoice.transportCost.toFixed(2)}</span>
              </div>
            )}
            {invoice.labourCost > 0 && (
              <div className="flex justify-between text-sm sm:text-base">
                <span>Labour Cost:</span>
                <span className="font-medium">₦{invoice.labourCost.toFixed(2)}</span>
              </div>
            )}
            {(invoice.transportCost > 0 || invoice.labourCost > 0) && (
              <div className="flex justify-between border-t pt-2 text-sm sm:text-base">
                <span>Subtotal (with costs):</span>
                <span className="font-medium">₦{subtotalWithCosts.toFixed(2)}</span>
              </div>
            )}
            {/* <div className="flex justify-between text-sm sm:text-base">
              <span>Tax (7.5%):</span>
              <span className="font-medium">₦{tax.toFixed(2)}</span>
            </div> */}
            <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-primary">₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t pt-3 sm:pt-4 mt-4 sm:mt-6">
            <h3 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground mb-2">
              Notes
            </h3>
            <p className="text-xs sm:text-sm whitespace-pre-line break-words">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-3 sm:pt-4 text-center text-xs text-muted-foreground">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
