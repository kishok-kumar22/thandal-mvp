import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THANDAL - Lending & Collection Management",
  description: "Modern lending and collection management platform",
};

import { DevUserSwitcher } from "@/components/ui/DevUserSwitcher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased text-[#334155] bg-[#F4F7FB]">
        {children}
        <DevUserSwitcher />
      </body>
    </html>
  );
}
