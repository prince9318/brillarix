// components/UI/ThemeToggle.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  // optional: parent can pass a callback instead of using URL
  onSearch?: (q: string) => void;
};

export default function ThemeToggle({ onSearch }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [search, setSearch] = useState("");
  const debounceRef = useRef<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // initialize theme
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
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // initialize search from URL if present
  useEffect(() => {
    const q = searchParams?.get("search") ?? "";
    setSearch(q);
  }, [searchParams]);

  function toggle() {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  }

  function setUrlSearch(q: string) {
    if (onSearch) {
      onSearch(q);
      return;
    }
    // update URL without adding history entries
    const url = new URL(window.location.href);
    if (q.trim()) url.searchParams.set("search", q.trim());
    else url.searchParams.delete("search");
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
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 8,
          padding: "6px 10px",
          minWidth: 240,
          background: "var(--card)",
        }}
      >
        <button
          onClick={onClickSearch}
          aria-label="Search"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Search size={16} style={{ color: "var(--muted)" }} />
        </button>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: 14,
            background: "transparent",
            color: "var(--text)",
            marginLeft: 8,
          }}
        />

        {search ? (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              marginLeft: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={16} style={{ color: "var(--muted)" }} />
          </button>
        ) : null}
      </div>

      <button
        onClick={toggle}
        aria-label="Toggle theme"
        style={{
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.06)",
          background: "transparent",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
