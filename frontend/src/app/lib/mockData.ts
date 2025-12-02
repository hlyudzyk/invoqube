import { Invoice, InvoiceStats } from './types';

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Acme Corporation',
    clientEmail: 'billing@acme.com',
    clientAddress: '123 Business St, New York, NY 10001',
    amount: 2500.00,
    subtotal: 2272.73,
    tax: 227.27,
    status: 'paid',
    issueDate: '2024-11-01',
    dueDate: '2024-11-15',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 40, price: 50, total: 2000 },
      { id: '2', description: 'UI/UX Design Consultation', quantity: 5, price: 60, total: 300 }
    ],
    notes: 'Thank you for your business!'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'TechStart Inc',
    clientEmail: 'accounts@techstart.io',
    clientAddress: '456 Innovation Ave, San Francisco, CA 94102',
    amount: 5800.00,
    subtotal: 5272.73,
    tax: 527.27,
    status: 'sent',
    issueDate: '2024-11-10',
    dueDate: '2024-12-10',
    items: [
      { id: '1', description: 'Mobile App Development', quantity: 80, price: 60, total: 4800 },
      { id: '2', description: 'API Integration', quantity: 10, price: 50, total: 500 }
    ],
    notes: 'Payment terms: Net 30'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Global Solutions Ltd',
    clientEmail: 'finance@globalsolutions.com',
    clientAddress: '789 Corporate Blvd, London, UK',
    amount: 3200.00,
    subtotal: 2909.09,
    tax: 290.91,
    status: 'overdue',
    issueDate: '2024-10-15',
    dueDate: '2024-11-15',
    items: [
      { id: '1', description: 'System Maintenance', quantity: 20, price: 80, total: 1600 },
      { id: '2', description: 'Cloud Infrastructure Setup', quantity: 15, price: 100, total: 1500 }
    ],
    notes: 'Overdue payment - please remit immediately'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'Creative Agency Pro',
    clientEmail: 'hello@creativeagency.pro',
    clientAddress: '321 Design Lane, Austin, TX 78701',
    amount: 1800.00,
    subtotal: 1636.36,
    tax: 163.64,
    status: 'draft',
    issueDate: '2024-11-25',
    dueDate: '2024-12-25',
    items: [
      { id: '1', description: 'Brand Identity Design', quantity: 1, price: 1500, total: 1500 },
      { id: '2', description: 'Logo Design Revisions', quantity: 2, price: 75, total: 150 }
    ],
    notes: 'Draft - pending client approval'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    clientName: 'DataCorp Analytics',
    clientEmail: 'billing@datacorp.com',
    clientAddress: '555 Data Drive, Seattle, WA 98101',
    amount: 4500.00,
    subtotal: 4090.91,
    tax: 409.09,
    status: 'sent',
    issueDate: '2024-11-20',
    dueDate: '2024-12-20',
    items: [
      { id: '1', description: 'Data Visualization Dashboard', quantity: 30, price: 100, total: 3000 },
      { id: '2', description: 'Analytics Integration', quantity: 15, price: 100, total: 1500 }
    ],
    notes: 'Payment expected by due date'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    clientName: 'E-Commerce Ventures',
    clientEmail: 'accounts@ecomventures.com',
    clientAddress: '999 Retail Road, Miami, FL 33101',
    amount: 6200.00,
    subtotal: 5636.36,
    tax: 563.64,
    status: 'paid',
    issueDate: '2024-10-05',
    dueDate: '2024-11-05',
    items: [
      { id: '1', description: 'E-commerce Platform Development', quantity: 100, price: 55, total: 5500 },
      { id: '2', description: 'Payment Gateway Integration', quantity: 1, price: 200, total: 200 }
    ],
    notes: 'Paid in full - thank you!'
  },
  {
    id: '7',
    invoiceNumber: 'INV-2024-007',
    clientName: 'Marketing Masters',
    clientEmail: 'finance@marketingmasters.net',
    clientAddress: '777 Campaign Circle, Chicago, IL 60601',
    amount: 2900.00,
    subtotal: 2636.36,
    tax: 263.64,
    status: 'overdue',
    issueDate: '2024-10-01',
    dueDate: '2024-11-01',
    items: [
      { id: '1', description: 'SEO Optimization', quantity: 20, price: 80, total: 1600 },
      { id: '2', description: 'Content Marketing Strategy', quantity: 10, price: 120, total: 1200 }
    ],
    notes: 'Second reminder - payment overdue'
  },
  {
    id: '8',
    invoiceNumber: 'INV-2024-008',
    clientName: 'FinTech Innovations',
    clientEmail: 'ap@fintechinnovations.com',
    clientAddress: '100 Finance Plaza, Boston, MA 02101',
    amount: 7500.00,
    subtotal: 6818.18,
    tax: 681.82,
    status: 'sent',
    issueDate: '2024-11-28',
    dueDate: '2024-12-28',
    items: [
      { id: '1', description: 'Blockchain Integration', quantity: 50, price: 120, total: 6000 },
      { id: '2', description: 'Smart Contract Development', quantity: 10, price: 90, total: 900 }
    ],
    notes: 'Payment terms: Net 30 days'
  }
];

export const mockStats: InvoiceStats = {
  total: mockInvoices.length,
  pending: mockInvoices.filter(inv => inv.status === 'sent').length,
  paid: mockInvoices.filter(inv => inv.status === 'paid').length,
  overdue: mockInvoices.filter(inv => inv.status === 'overdue').length,
  totalRevenue: mockInvoices.reduce((sum, inv) => sum + inv.amount, 0),
  pendingRevenue: mockInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)
};
