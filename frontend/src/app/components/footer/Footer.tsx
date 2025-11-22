'use client'
import React, { useState } from 'react';

export type CategoryLinkElementProps = {
  title: string;
  description: string;
};

const categoryLinkElementsSeed: CategoryLinkElementProps[] = [
  { title: 'Automated OCR', description: 'Scan & extract invoice data' },
  { title: 'Approval Workflows', description: 'Multi-level approvals' },
  { title: 'Payment Tracking', description: 'Monitor due & overdue invoices' },
  { title: 'Vendor Management', description: 'Keep supplier records organized' },
  { title: 'Expense Categorization', description: 'Automatic tagging & rules' },
  { title: 'Analytics & Insights', description: 'Financial health dashboard' },
  { title: 'Integrations', description: 'ERP & accounting software sync' },
];

const categories = [
  'Automation',
  'Workflows',
  'Compliance',
  'Payments',
  'Reporting',
  'Integrations',
  'Security',
];

const Footer = () => {
  const [category, setCategory] = useState<string>('Automation');

  return (
    <div className="mt-52 w-full bg-gray-100 flex items-center justify-center">
      <div className="w-[90%] h-[80%] pt-10">
        <h2 className="text-xl text-gray-800 font-semibold mb-5">
          Invoice workflow guidance & resources
        </h2>

        <div className="flex flex-wrap justify-start gap-x-7 pb-5">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`flex items-center cursor-pointer ${
                category === cat
                  ? 'border-b-2 border-gray-900 text-gray-800'
                  : 'border-gray-300 text-gray-600'
              }`}
              onClick={() => setCategory(cat)}
            >
              <span className="text-sm font-semibold">{cat}</span>
            </div>
          ))}
        </div>

        <hr className="my-5" />

        <div className="flex flex-col sm:flex-row justify-start gap-y-5 sm:gap-x-10 py-12">
          {categoryLinkElementsSeed.map((element) => (
            <div key={element.title} className="flex flex-col">
              <span className="font-semibold text-gray-900">{element.title}</span>
              <span className="text-gray-600">{element.description}</span>
            </div>
          ))}
        </div>

        <hr className="my-5" />

        <div className="flex flex-col sm:flex-row justify-start gap-y-10 sm:gap-x-20 pt-12">
          <div className="flex flex-col gap-y-3">
            <h1 className="font-semibold">Support</h1>
            <p className="cursor-pointer">Help Center</p>
            <p className="cursor-pointer">Submit a Ticket</p>
            <p className="cursor-pointer">API Documentation</p>
            <p className="cursor-pointer">Status Page</p>
          </div>

          <div className="flex flex-col gap-y-3">
            <h1 className="font-semibold">Product</h1>
            <p className="cursor-pointer">Features</p>
            <p className="cursor-pointer">Roadmap</p>
            <p className="cursor-pointer">Integrations</p>
            <p className="cursor-pointer">Security</p>
          </div>

          <div className="flex flex-col gap-y-3">
            <h1 className="font-semibold">Company</h1>
            <p className="cursor-pointer">About Us</p>
            <p className="cursor-pointer">Careers</p>
            <p className="cursor-pointer">Press</p>
            <p className="cursor-pointer">Partners</p>
          </div>
        </div>

        <hr className="my-5" />

        <div className="flex flex-col sm:flex-row justify-between gap-y-5 sm:gap-x-20 py-5">
          <div className="flex flex-col sm:flex-row justify-between gap-x-5">
            <p className="cursor-pointer">© 2025 Invoqube, Inc.</p>
            <p className="cursor-pointer">Terms</p>
            <p className="cursor-pointer">Sitemap</p>
            <p className="cursor-pointer">Privacy</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-x-5">
            <span className="cursor-pointer flex flex-row items-center gap-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              English (US)
            </span>
            <p className="cursor-pointer">€ EUR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;