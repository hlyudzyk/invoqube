import React from 'react';
import Link from 'next/link';
import { Invoice } from '@/app/lib/types';
import StatusBadge from './StatusBadge';

interface InvoiceCardProps {
  invoice: Invoice;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/invoices/${invoice.id}`}>
      <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
            <p className="text-sm text-gray-600 mt-1">{invoice.clientName}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Issue Date:</span>
            <span className="text-gray-700">{formatDate(invoice.issueDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Due Date:</span>
            <span className="text-gray-700">{formatDate(invoice.dueDate)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default InvoiceCard;
