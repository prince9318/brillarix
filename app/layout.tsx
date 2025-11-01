// app/layout.tsx
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

const setThemeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  } catch (e) { /* ignore */ }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* inline script runs before React hydrates to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
      </head>
      <body>
        <header className={styles.siteHeader}>
          <div className={`${styles.container} ${styles.headerInner}`}>
            <Link
              href="/"
              className={styles.brand}
              style={{ textDecoration: "none" }}
            >
              Product Explorer
            </Link>

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
