import "./globals.css";
import React, { Suspense } from "react";
import Link from "next/link";
import ThemeToggle from "../components/UI/ThemeToggle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Explorer",
  description: "Product listing demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            {/* Logo linked to home page */}
            <Link href="/" className="brand" style={{ textDecoration: "none" }}>
              Product Explorer
            </Link>

            {/* ThemeToggle is a client component that contains the search input + toggle */}
            <div className="header-actions">
              <Suspense fallback={<div>Loading...</div>}>
                <ThemeToggle />
              </Suspense>
            </div>
          </div>
        </header>

        <main className="container main">{children}</main>

        <footer className="site-footer">
          <div className="container">
            © {new Date().getFullYear()} Product Explorer. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
