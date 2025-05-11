import type { Metadata } from "next";
import "./globals.css";

// Correct approach for App Router: Use a Client Component wrapper for the Provider
import StoreProvider from "./StoreProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "NaijaLearn",
  description: "Interactive Nigerian Cultural Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the application with the StoreProvider Client Component */}
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}