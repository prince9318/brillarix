"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ThemeToggle.module.css";

type Props = {
  onSearch?: (q: string) => void;
};

export default function ThemeToggle({ onSearch }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [search, setSearch] = useState("");
  const debounceRef = useRef<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // initialize theme from localStorage or prefers-color-scheme
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const initial =
      (saved as "light" | "dark") ||
      (typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  // initialize search from URL if present
  useEffect(() => {
    const q = searchParams?.get("search") ?? "";
    setSearch(q);
  }, [searchParams]);

  function toggle() {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("theme", t);
    }
  }

  function setUrlSearch(q: string) {
    if (onSearch) {
      onSearch(q);
      return;
    }

    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    if (q.trim()) url.searchParams.set("search", q.trim());
    else url.searchParams.delete("search");

    // Replace without creating a new history entry
    router.replace(url.pathname + url.search);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setSearch(v);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setUrlSearch(v);
    }, 300);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      setUrlSearch(search);
    }
  }

  function onClickSearch() {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setUrlSearch(search);
  }

  function clearSearch() {
    setSearch("");
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setUrlSearch("");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <button
          onClick={onClickSearch}
          aria-label="Search"
          className={styles.searchBtn}
          type="button"
        >
          <Search size={16} style={{ color: "var(--muted)" }} />
        </button>

        <input
          className={styles.input}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
        />

        {search ? (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className={styles.clearBtn}
            type="button"
          >
            <X size={16} style={{ color: "var(--muted)" }} />
          </button>
        ) : null}
      </div>

      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className={styles.toggleBtn}
        type="button"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
