'use client';

import { useState, useEffect } from 'react';
import { Invoice } from '@/lib/types';

const STORAGE_KEY = 'invoices';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever invoices change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    }
  }, [invoices, isLoaded]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
  };

  const updateInvoice = (id: string, invoice: Invoice) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? invoice : inv)));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const getInvoice = (id: string) => {
    return invoices.find((inv) => inv.id === id);
  };

  return {
    invoices,
    isLoaded,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
  };
}
