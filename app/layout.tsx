import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DarkModeToggle from "./components/DarkModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Booking App",
  description: "Book seats for your favorite events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Event Booking</h1>
            <DarkModeToggle />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          Event Booking App built with Next.js
        </footer>
      </body>
    </html>
  );
}
