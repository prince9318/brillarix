// components/ProductListingClient.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product } from "../types/product";
import Filters from "./Filters/Filters";
import ViewToggle from "./UI/ViewToggle";
import ProductCard from "./ProductCard/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductListingClient({
  products,
}: {
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const [page, setPage] = useState<number>(1);
  const perPage = 9;

  // view mode state (grid | list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // initialize search from URL (runs on mount and when URL changes)
  useEffect(() => {
    const q = searchParams?.get("search") ?? "";
    setSearch(q);
  }, [searchParams]);

  // push search -> URL when local search changes (avoid unnecessary replace)
  useEffect(() => {
    const current = searchParams?.get("search") ?? "";
    if (search !== current) {
      const url = new URL(window.location.href);
      if (search.trim()) url.searchParams.set("search", search.trim());
      else url.searchParams.delete("search");

      // replace to avoid back-button spam
      router.replace(url.pathname + url.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); // intentionally only depend on search

  // Unique categories
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let result = products;
    if (search.trim())
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    if (category !== "All")
      result = result.filter((p) => p.category === category);
    if (sort === "asc")
      result = result.slice().sort((a, b) => a.price - b.price);
    if (sort === "desc")
      result = result.slice().sort((a, b) => b.price - a.price);
    return result;
  }, [products, search, category, sort]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  // For "Showing X–Y of Z"
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  function goto(p: number) {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseBtn = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid var(--control-border, rgba(0,0,0,0.06))",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  } as React.CSSProperties;

  return (
    <div style={{ display: "contents" }}>
      {/* Left filters */}
      <div>
        <Filters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* Right listing */}
      <div>
        {/* Header row: Title + View Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ marginBottom: 12, color: "var(--muted)" }}>
            Showing <strong>{start}</strong>–<strong>{end}</strong> of{" "}
            <strong>{total}</strong> products
          </div>

          <div>
            {/* ViewToggle: uses initial + onChange API (the Tailwind version) */}
            <ViewToggle initial={viewMode} onChange={(m) => setViewMode(m)} />
          </div>
        </div>

        {/* Product list: grid or stacked list */}
        {viewMode === "grid" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 18,
            }}
          >
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} viewMode="list" />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {/* Previous */}
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            style={{
              ...baseBtn,
              background: page === 1 ? "var(--card)" : "var(--primary)",
              color: page === 1 ? "var(--muted)" : "#fff",
              opacity: page === 1 ? 0.6 : 1,
            }}
          >
            Previous
          </button>

          {/* Page numbers */}
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => goto(p)}
              style={{
                ...baseBtn,
                background: p === page ? "var(--primary)" : "var(--card)",
                color: p === page ? "#fff" : "var(--text)",
                fontWeight: p === page ? 600 : 500,
              }}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => goto(page + 1)}
            disabled={page === totalPages}
            style={{
              ...baseBtn,
              background:
                page === totalPages ? "var(--card)" : "var(--primary)",
              color: page === totalPages ? "var(--muted)" : "#fff",
              opacity: page === totalPages ? 0.6 : 1,
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
