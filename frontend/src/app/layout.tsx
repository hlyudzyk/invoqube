import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoginModal from "@/app/components/modals/LoginModal";
import SignupModal from "@/app/components/modals/SignupModal";
import ConditionalNavbar from "@/app/components/ConditionalNavbar";
import ConditionalLayout from "@/app/components/ConditionalLayout";
import { Inter } from "next/font/google";
import Footer from "@/app/components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoqube - Invoice Management",
  description: "Manage your invoices with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConditionalNavbar />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <LoginModal/>
        <SignupModal/>
      </body>
    </html>
  );
}
