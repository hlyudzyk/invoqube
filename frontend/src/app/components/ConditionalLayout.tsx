'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/app/components/footer/Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on login and register pages
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  return (
    <>
      <div className="pt-32">
        {children}
      </div>
      <Footer />
    </>
  );
}
