// app/page.tsx
import React, { Suspense } from "react";
import ProductListingClient from "../components/ProductListingClient";
import type { Product } from "../types/product";
import Link from "next/link";

export const metadata = {
  title: "Product Explorer",
  description: "Browse products fetched from Fake Store API",
};

async function fetchProducts(): Promise<Product[]> {
  // Server-side fetch with ISR-style revalidation
  const res = await fetch("https://fakestoreapi.com/products", {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    // Throw a standard Error - we catch this in the page and render an error UI
    throw new Error("Failed to fetch products from fakestoreapi");
  }
  const data = (await res.json()) as Product[];
  return data;
}

export default async function Page() {
  let products: Product[] = [];

  try {
    products = await fetchProducts();
  } catch (err) {
    // Server-side error UI (static). This runs server-side so no client hooks here.
    return (
      <div style={{ padding: 40 }}>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>
          Failed to load products
        </h1>
        <p style={{ color: "var(--muted, #6b7280)", marginBottom: 16 }}>
          There was a problem fetching products from the API. Please check your
          network connection or try again later.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "var(--primary, #2563eb)",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Retry
          </Link>

          <Link
            href="/"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "transparent",
              textDecoration: "none",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // When fetch succeeds, render the interactive client component.
  // Wrap in Suspense to provide a fallback while the client bundle hydrates.
  return (
    <React.Fragment>
      <Suspense
        fallback={
          <div style={{ padding: 28 }}>
            <div style={{ color: "var(--muted, #6b7280)" }}>
              Loading product listing…
            </div>
          </div>
        }
      >
        <ProductListingClient products={products} />
      </Suspense>
    </React.Fragment>
  );
}
