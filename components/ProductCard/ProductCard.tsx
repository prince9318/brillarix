// productcard.tsx code
"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types/product";

export default function ProductCard({
  product,
  viewMode,
}: {
  product: Product;
  viewMode: "grid" | "list";
}) {
  const rate = product.rating?.rate ?? 0;
  const fullStars = Math.floor(rate);
  const hasHalf = rate - fullStars >= 0.5;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < fullStars) return "full";
    if (i === fullStars && hasHalf) return "half";
    return "empty";
  });

  const cardBg = { background: "var(--card)" };

  return (
    <article
      style={cardBg}
      className={`rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-(--primary) ${
        viewMode === "list" ? "shadow-sm" : "shadow"
      }`}
    >
      {/* container for grid: stacked; for list: horizontal flex */}
      <div
        className={`${
          viewMode === "list"
            ? "flex items-center gap-4 p-4"
            : "flex flex-col p-4"
        }`}
      >
        {/* Image area */}
        <Link
          href={`/product/${product.id}`}
          aria-label={product.title}
          className={`${viewMode === "list" ? "shrink-0" : ""} block`} // ✅ fixed here
          style={{
            width: viewMode === "list" ? 120 : "100%",
            height: viewMode === "list" ? 120 : 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </Link>

        {/* Content */}
        <div
          className={`${viewMode === "list" ? "flex-1" : ""} mt-3`}
          style={{ minWidth: 0 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text)" }}>
              {product.title}
            </h3>
            <span
              style={{
                background: "transparent",
                border: "1px solid var(--control-border)",
                padding: "6px 8px",
                borderRadius: 8,
                color: "var(--muted)",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {product.category}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div aria-hidden style={{ display: "flex", gap: 2 }}>
                {stars.map((s, idx) => {
                  if (s === "full")
                    return (
                      <span
                        key={idx}
                        style={{ color: "#fbbf24" /* amber-400 */ }}
                      >
                        ★
                      </span>
                    );
                  if (s === "half")
                    return (
                      <span key={idx} style={{ color: "#fbbf24" }}>
                        ★
                      </span>
                    );
                  return (
                    <span key={idx} style={{ color: "var(--muted)" }}>
                      ★
                    </span>
                  );
                })}
              </div>

              <div style={{ color: "var(--muted)" }}>
                ({product.rating?.rate ?? "—"})
              </div>
            </div>

            <div style={{ fontWeight: 700, color: "var(--text)" }}>
              ${product.price.toFixed(2)}
            </div>
          </div>

          {/* Description for list view */}
          {viewMode === "list" ? (
            <p style={{ color: "var(--muted)", marginTop: 10 }}>
              {product.description?.slice(0, 180)}
              {product.description && product.description.length > 180
                ? "…"
                : ""}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
