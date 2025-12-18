'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { LineItem } from '@/app/lib/types';

// Custom dropdown component for item descriptions
const DescriptionInput = ({ 
  value, 
  onChange, 
  dataItemId,
  commonDescriptions 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  dataItemId: string;
  commonDescriptions: string[];
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(commonDescriptions);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    // Filter options based on input
    const filtered = commonDescriptions.filter(desc =>
      desc.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(true);
  };

  const handleSelectOption = (option: string) => {
    onChange(option);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          setFilteredOptions(commonDescriptions);
          setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        data-item-id={dataItemId}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Select or type item description"
      />
      {showDropdown && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectOption(option)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-900 transition-colors"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function NewInvoicePage() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Refs for form fields
  const clientNameRef = useRef<HTMLInputElement>(null);
  const clientEmailRef = useRef<HTMLInputElement>(null);
  const issueDateRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  
  // Calculate initial due date (7 days from today)
  const calculateDueDate = (date: string) => {
    const issueDateTime = new Date(date);
    issueDateTime.setDate(issueDateTime.getDate() + 7);
    return issueDateTime.toISOString().split('T')[0];
  };
  
  const [dueDate, setDueDate] = useState(calculateDueDate(new Date().toISOString().split('T')[0]));
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, total: 0 }
  ]);

  // Predefined item descriptions
  const commonDescriptions = [
    'Web Development Services',
    'Graphic Design',
    'Consulting Services',
    'Software License',
    'Monthly Subscription'
  ];

  const addItem = () => {
    const newItem: LineItem = {
      id: String(items.length + 1),
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updated.total = updated.quantity * updated.price;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields and focus on first missing field
    if (!clientName.trim()) {
      clientNameRef.current?.focus();
      return;
    }
    
    if (!clientEmail.trim()) {
      clientEmailRef.current?.focus();
      return;
    }
    
    if (!issueDate) {
      issueDateRef.current?.focus();
      return;
    }
    
    if (!dueDate) {
      dueDateRef.current?.focus();
      return;
    }
    
    // Validate items have descriptions
    const firstEmptyItem = items.find(item => !item.description.trim());
    if (firstEmptyItem) {
      // Focus on the first item with empty description
      const itemElement = document.querySelector(`input[data-item-id="${firstEmptyItem.id}"]`) as HTMLInputElement;
      itemElement?.focus();
      return;
    }
    
    // This is a prototype - in real app, this would call an API
    alert('Invoice created successfully! (This is a prototype)');
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 pb-12">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
            ← Back to Invoices
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Invoice</h1>
        <p className="text-gray-600">Fill in the details below to generate a new invoice</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-lg shadow-lg p-8">
        {/* Client Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={clientNameRef}
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Email <span className="text-red-500">*</span>
              </label>
              <input
                ref={clientEmailRef}
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="client@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Address
              </label>
              <textarea
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client address"
              />
            </div>
          </div>
        </div>

        {/* Invoice Dates */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Invoice Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                ref={issueDateRef}
                type="date"
                required
                value={issueDate}
                onChange={(e) => {
                  setIssueDate(e.target.value);
                  setDueDate(calculateDueDate(e.target.value));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                ref={dueDateRef}
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={issueDate}
              />
              <p className="text-xs text-gray-500 mt-1">Automatically set to 7 days after issue date</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <DescriptionInput
                      value={item.description}
                      onChange={(value) => updateItem(item.id, 'description', value)}
                      dataItemId={item.id}
                      commonDescriptions={commonDescriptions}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-3 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total
                    </label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold">
                      ${item.total.toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-1 flex items-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="max-w-md ml-auto space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (10%):</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes or payment terms..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link href="/invoices">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
          </Link>
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </main>
  );
}
