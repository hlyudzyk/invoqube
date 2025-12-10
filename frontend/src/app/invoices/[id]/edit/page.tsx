'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiService from '@/app/services/apiServices';

interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: string;
  can_edit: boolean;
  items: InvoiceItem[];
}

interface AuditLog {
  id: number;
  action: string;
  timestamp: string;
  user_name: string;
  user_email: string;
  changes: any;
  description: string;
}

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    invoice_number: '',
    issue_date: '',
    due_date: '',
    items: [] as InvoiceItem[],
  });

  useEffect(() => {
    fetchInvoice();
    fetchAuditLogs();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const data = await apiService.get(`/api/invoices/${invoiceId}/`);
      setInvoice(data);
      setFormData({
        invoice_number: data.invoice_number,
        issue_date: data.issue_date,
        due_date: data.due_date,
        items: data.items.map((item: any) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoice');
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const data = await apiService.get(`/api/invoices/${invoiceId}/audit-log/`);
      setAuditLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice?.can_edit) {
      setError('Only draft invoices can be edited');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await apiService.put(`/api/invoices/${invoiceId}/edit/`, formData);
      setSuccess('Invoice updated successfully');
      fetchInvoice(); // Refresh invoice data
      fetchAuditLogs(); // Refresh audit logs
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update invoice');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: '', quantity: 1, unit_price: '0.00' },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.unit_price || '0'),
      0
    );
  };

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  if (!invoice?.can_edit) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Cannot Edit Invoice</h2>
          <p>Only invoices in draft status can be edited. This invoice is {invoice?.status}.</p>
          <button
            onClick={() => router.push(`/invoices/${invoiceId}`)}
            className="mt-4 px-4 py-2 bg-accent hover:bg-accent-dark text-brand rounded-lg"
          >
            View Invoice
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand">Edit Invoice</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-brand rounded-lg"
          >
            {showAuditLog ? 'Hide' : 'Show'} Audit Log
          </button>
          <button
            onClick={() => router.push(`/invoices/${invoiceId}`)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-brand rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {showAuditLog && (
        <div className="mb-6 bg-base-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-brand mb-4">Audit Log</h2>
          {auditLogs.length === 0 ? (
            <p className="text-gray-600">No changes recorded yet</p>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-accent pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-brand">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.description}</p>
                      <p className="text-xs text-gray-500">
                        By {log.user_name || log.user_email} at{' '}
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="font-semibold text-gray-700">Changes:</p>
                      <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-base-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-brand mb-2">
              Invoice Number
            </label>
            <input
              type="text"
              value={formData.invoice_number}
              onChange={(e) =>
                setFormData({ ...formData, invoice_number: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand mb-2">
              Issue Date
            </label>
            <input
              type="date"
              value={formData.issue_date}
              onChange={(e) =>
                setFormData({ ...formData, issue_date: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-brand">Line Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-brand rounded-lg"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-end border border-gray-200 p-4 rounded-lg"
              >
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-brand mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, 'description', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium text-brand mb-2">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_price}
                    onChange={(e) =>
                      updateItem(index, 'unit_price', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-right">
            <p className="text-2xl font-bold text-brand">
              Total: ${calculateTotal().toFixed(2)}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-brand font-semibold rounded-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </main>
  );
}
