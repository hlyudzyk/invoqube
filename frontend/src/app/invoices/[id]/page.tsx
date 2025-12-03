'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockInvoices } from '@/app/lib/mockData';
import StatusBadge from '@/app/components/invoices/StatusBadge';

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoice = mockInvoices.find(inv => inv.id === params.id);

  if (!invoice) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 pb-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
          <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
            ← Back to Invoices
          </Link>
        </div>
      </main>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
            ← Back to Invoices
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{invoice.invoiceNumber}</h1>
            <p className="text-gray-600">Invoice Details</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex space-x-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          Download PDF
        </button>
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
          Send to Client
        </button>
        {invoice.status !== 'paid' && (
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
            Mark as Paid
          </button>
        )}
        {invoice.status === 'draft' && (
          <Link href={`/invoices/${invoice.id}/edit`}>
            <button className="px-6 py-3 bg-accent hover:bg-accent-dark text-brand rounded-lg transition-colors font-semibold">
              Edit Invoice
            </button>
          </Link>
        )}
      </div>

      {/* Invoice Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">INVOICE</h2>
              <p className="text-gray-600">Invoice Number: {invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900">Invoqube</p>
            </div>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To:</h3>
            <p className="font-semibold text-gray-900">{invoice.clientName}</p>
            <p className="text-gray-600">{invoice.clientEmail}</p>
            {invoice.clientAddress && (
              <p className="text-gray-600 mt-1">{invoice.clientAddress}</p>
            )}
          </div>
          <div className="text-right">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Issue Date</p>
              <p className="font-semibold text-gray-900">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-900">{item.description}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{formatCurrency(item.price)}</td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (10%):</span>
              <span className="font-semibold">{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
              <span>Total:</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h3>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 mt-8 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>

      {/* Payment Timeline (for demonstration) */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-4"></div>
            <div>
              <p className="font-semibold text-gray-900">Invoice Created</p>
              <p className="text-sm text-gray-600">{formatDate(invoice.issueDate)}</p>
            </div>
          </div>
          {invoice.status !== 'draft' && (
            <div className="flex items-start">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Invoice Sent</p>
                <p className="text-sm text-gray-600">Sent to {invoice.clientEmail}</p>
              </div>
            </div>
          )}
          {invoice.status === 'paid' && (
            <div className="flex items-start">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Payment Received</p>
                <p className="text-sm text-gray-600">Paid in full</p>
              </div>
            </div>
          )}
          {invoice.status === 'overdue' && (
            <div className="flex items-start">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Payment Overdue</p>
                <p className="text-sm text-gray-600">Due date: {formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
