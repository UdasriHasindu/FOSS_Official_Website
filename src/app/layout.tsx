import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";


export const metadata: Metadata = {
  title: "Foss UOK official Website",
  description: "This is the official website of Foss UOK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="text-center py-4 border-t mt-8">
          &copy; {new Date().getFullYear()} FOSS UOK
        </footer>
      </body>
    </html>
  );
}
