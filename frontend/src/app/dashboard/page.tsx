'use client';

import Link from 'next/link';
import { mockInvoices, mockStats } from '../lib/mockData';
import StatsCard from '../components/invoices/StatsCard';
import InvoiceCard from '../components/invoices/InvoiceCard';

export default function DashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const recentInvoices = mockInvoices.slice(0, 4);

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Invoice Dashboard</h1>
        <p className="text-lg text-gray-600">
          Manage your invoices, track payments, and analyze your business performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          title="Total Invoices"
          value={mockStats.total}
          subtitle="All time"
          color="blue"
        />
        <StatsCard
          title="Paid"
          value={mockStats.paid}
          subtitle={formatCurrency(mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0))}
          color="green"
        />
        <StatsCard
          title="Pending"
          value={mockStats.pending}
          subtitle={formatCurrency(mockInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0))}
          color="yellow"
        />
        <StatsCard
          title="Overdue"
          value={mockStats.overdue}
          subtitle={formatCurrency(mockInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0))}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/invoices/new">
            <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Invoice</h3>
                  <p className="text-sm text-gray-600">Generate a new invoice</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/invoices">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View All Invoices</h3>
                  <p className="text-sm text-gray-600">Manage all invoices</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/analytics">
            <div className="p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">View insights & reports</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Invoices */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Invoices</h2>
          <Link href="/invoices" className="text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      </div>
    </main>
  );
}
