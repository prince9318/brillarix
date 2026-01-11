import { NextResponse } from "next/server";
import type { Product } from "../../../types/product";

const FALLBACK: Product[] = [
  {
    id: 999999,
    title: "Sample Product (fallback)",
    price: 19.99,
    description:
      "This is a fallback sample product used when the external API is unavailable.",
    category: "sample",
    image: "/fallback-product.png",
    rating: { rate: 4.5, count: 10 },
  },
];

export async function GET() {
  try {
    // Proxy the external API. This request runs server-side.
    const res = await fetch("https://fakestoreapi.com/products", {
      // Cache at the edge / server for a short time
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch from fakestoreapi");

    const products: Product[] = await res.json();

    return NextResponse.json(products, {
      status: 200,
      headers: {
        // s-maxage for ISR-like behaviour on deployments that support it
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    // If external API fails, return fallback so the frontend still renders.
    return NextResponse.json(FALLBACK, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }
}
