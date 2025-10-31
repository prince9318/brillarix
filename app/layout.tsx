import "./globals.css";
import styles from "./layout.module.css";
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
        <header className={styles.siteHeader}>
          <div className={`${styles.container} ${styles.headerInner}`}>
            {/* Logo linked to home page */}
            <Link
              href="/"
              className={styles.brand}
              style={{ textDecoration: "none" }}
            >
              Product Explorer
            </Link>

            {/* ThemeToggle is a client component that contains the search input + toggle */}
            <div className={styles.headerActions}>
              <Suspense fallback={<div>Loading...</div>}>
                <ThemeToggle />
              </Suspense>
            </div>
          </div>
        </header>

        <main className={`${styles.container} ${styles.main}`}>{children}</main>
        <footer className={styles.siteFooter}>
          <div className={styles.container}>
            © {new Date().getFullYear()} Product Explorer. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
