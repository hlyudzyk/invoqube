'use client';

import React from 'react';
import { mockInvoices, mockStats } from '../lib/mockData';
import StatsCard from '../components/invoices/StatsCard';

export default function AnalyticsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate revenue by month
  const revenueByMonth = mockInvoices.reduce((acc, invoice) => {
    const month = new Date(invoice.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + (invoice.status === 'paid' ? invoice.amount : 0);
    return acc;
  }, {} as Record<string, number>);

  // Top clients by revenue
  const clientRevenue = mockInvoices.reduce((acc, invoice) => {
    acc[invoice.clientName] = (acc[invoice.clientName] || 0) + invoice.amount;
    return acc;
  }, {} as Record<string, number>);

  const topClients = Object.entries(clientRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Status distribution
  const statusCounts = {
    draft: mockInvoices.filter(inv => inv.status === 'draft').length,
    sent: mockInvoices.filter(inv => inv.status === 'sent').length,
    paid: mockInvoices.filter(inv => inv.status === 'paid').length,
    overdue: mockInvoices.filter(inv => inv.status === 'overdue').length,
  };

  const totalPaidRevenue = mockInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalOverdueRevenue = mockInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Track your invoice performance and business metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(mockStats.totalRevenue)}
          subtitle="All invoices"
          color="blue"
        />
        <StatsCard
          title="Paid Revenue"
          value={formatCurrency(totalPaidRevenue)}
          subtitle={`${mockStats.paid} invoices`}
          color="green"
        />
        <StatsCard
          title="Pending Revenue"
          value={formatCurrency(mockStats.pendingRevenue)}
          subtitle={`${mockStats.pending + mockStats.overdue} invoices`}
          color="yellow"
        />
        <StatsCard
          title="Overdue Amount"
          value={formatCurrency(totalOverdueRevenue)}
          subtitle={`${mockStats.overdue} invoices`}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Invoice Status Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Paid</span>
                <span className="font-semibold text-green-600">{statusCounts.paid} invoices</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(statusCounts.paid / mockStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Sent</span>
                <span className="font-semibold text-blue-600">{statusCounts.sent} invoices</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${(statusCounts.sent / mockStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Overdue</span>
                <span className="font-semibold text-red-600">{statusCounts.overdue} invoices</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: `${(statusCounts.overdue / mockStats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Draft</span>
                <span className="font-semibold text-gray-600">{statusCounts.draft} invoices</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-500 h-3 rounded-full"
                  style={{ width: `${(statusCounts.draft / mockStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Top Clients by Revenue</h2>
          <div className="space-y-4">
            {topClients.map(([clientName, revenue], index) => (
              <div key={clientName} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-900 font-medium">{clientName}</span>
                </div>
                <span className="text-gray-900 font-semibold">{formatCurrency(revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Month */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Revenue (Paid Invoices)</h2>
        <div className="space-y-4">
          {Object.entries(revenueByMonth).map(([month, revenue]) => (
            <div key={month}>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">{month}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(revenue)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${(revenue / Math.max(...Object.values(revenueByMonth))) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Average Invoice Value</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(mockStats.totalRevenue / mockStats.total)}
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
          <h3 className="font-semibold text-green-900 mb-2">Collection Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {((mockStats.paid / mockStats.total) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">Pending Collection</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {formatCurrency(mockStats.pendingRevenue)}
          </p>
        </div>
      </div>
    </main>
  );
}
