'use client'

import Link from 'next/link';

const CentralBar = () => {
  return(
      <div className="h-[48px] lg:h-[64px] flex flex-row items-center justify-between
      border border-brand-light rounded-full shadow-xl">
        <div className="hidden lg:block">
          <div className="flex flex-row items-center justify-between">
            <Link href="/invoices/new">
              <div
                  className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-brand-light text-accent transition-colors">
                <p className="text-xs font-semibold">New</p>
                <p className="text-sm">Create new invoice</p>
              </div>
            </Link>
            <Link href="/invoices">
              <div
                  className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-brand-light text-accent transition-colors">
                <p className="text-xs font-semibold">Manage</p>
                <p className="text-sm">Issued invoices</p>
              </div>
            </Link>
            <Link href="/analytics">
              <div
                  className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-brand-light text-accent transition-colors">
                <p className="text-xs font-semibold">Statistics</p>
                <p className="text-sm">Analyze performance</p>
              </div>
            </Link>
            <Link href="/account">
              <div
                  className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-brand-light text-accent transition-colors">
                <p className="text-xs font-semibold">Account</p>
                <p className="text-sm">Manage your data</p>
              </div>
            </Link>
        </div>
        </div>
        <div className="p-2">
          <div className="cursor-pointer p-4 bg-accent rounded-full hover:bg-accent-dark transition text-brand">
            <svg viewBox="0 0 32 32"
                 style={{display:'block',fill:'none',height:'16px',width:'16px',stroke:'currentColor',strokeWidth:4,
              overflow:'visible'}}
                 aria-hidden="true" role="presentation" focusable="false">
              <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"></path>
            </svg>
          </div>
        </div>
      </div>
  )
}

export default CentralBar;