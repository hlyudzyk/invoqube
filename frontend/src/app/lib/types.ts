export type UserType = {
  id:string;
  name:string;
  avatar_url:string;
  description:string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export type Invoice = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  notes?: string;
  tax: number;
  subtotal: number;
}

export type InvoiceStats = {
  total: number;
  pending: number;
  paid: number;
  overdue: number;
  totalRevenue: number;
  pendingRevenue: number;
}