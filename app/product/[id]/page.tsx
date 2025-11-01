// app/products/[id]/page.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import type { Product } from "../../../types/product";

type ParamsPromise = Promise<{ id: string }>;
type Props = { params: ParamsPromise };

export default function ProductPage({ params }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // unwrap the params promise (experimental React.use)
  const unwrappedParams = use(params);

  useEffect(() => {
    let mounted = true;
    async function fetchProduct() {
      try {
        const res = await fetch(
          `https://fakestoreapi.com/products/${unwrappedParams.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Product = await res.json();
        if (mounted) setProduct(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [unwrappedParams.id]);

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-600 dark:text-slate-300">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => Math.min(99, q + 1)); // safe upper bound

  return (
    <div className="w-280  bg-slate-50 dark:bg-slate-900">
      {/* Header / breadcrumb */}
      <header className="max-w-7xl mx-auto px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
        {/* Left: title + breadcrumb (inline) */}
        <div className="flex items-center gap-4 min-w-0">
          <h2 className="whitespace-nowrap text-lg font-semibold text-slate-900 dark:text-white">
            Product Explorer
          </h2>

          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 truncate">
            <span className="mx-2">›</span>

            {/* Category from API, nicely capitalized */}
            <span className="whitespace-nowrap">
              {product?.category
                ? // simple capitalization: "electronics" -> "Electronics"
                  product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)
                : "Category"}
            </span>

            <span className="mx-2">›</span>

            {/* Product title from API (may be long — truncate visually) */}
            <span className="whitespace-nowrap truncate max-w-[36ch]">
              {product?.title ?? "Product"}
            </span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="rounded-full p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-700 dark:text-slate-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Image */}
        <section className="w-full md:w-1/2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 h-full">
            <div className="w-full h-80 md:h-[420px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
              <Image
                src={product.image ?? "/product-fallback.png"}
                alt={product.title}
                width={1200}
                height={1200}
                className="object-contain max-h-full max-w-[520px] p-2"
                priority
              />
            </div>
          </div>
        </section>

        {/* Right: Info & purchase */}
        <aside className="w-full md:w-1/2">
          <div className="space-y-4">
            {/* category + rating */}
            <div className="flex items-center justify-start gap-6">
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm md:text-base font-medium">
                {product.category}
              </span>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400 dark:text-amber-500 text-xl md:text-2xl leading-none">
                  {product.rating &&
                    Array.from({ length: 5 }).map((_, i) => {
                      const rate = product.rating?.rate ?? 0;
                      return (
                        <span key={i} className="leading-none">
                          {i < Math.round(rate) ? "★" : "☆"}
                        </span>
                      );
                    })}
                </div>
                <div className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                  {product.rating ? `(${product.rating.rate.toFixed(1)})` : ""}
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </div>

            <div className="prose prose-sm md:prose md:prose-lg dark:prose-invert text-slate-600 dark:text-slate-300">
              <h3 className="text-base md:text-lg text-slate-800 dark:text-slate-200">
                Description
              </h3>
              <p className="mt-1">{product.description}</p>
            </div>

            {/* ---------- Improved Purchase Card (styled like your screenshot) ---------- */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              {/* Top row: Quantity (left) + Stock (right) */}
              <div className="flex items-center justify-between gap-4">
                {/* Quantity label + controls */}
                <div>
                  <div className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Quantity
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Decrease */}
                    <button
                      onClick={decreaseQuantity}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      −
                    </button>

                    {/* Quantity value */}
                    <div className="min-w-9 text-center font-semibold text-slate-900 dark:text-slate-100">
                      {quantity}
                    </div>

                    {/* Increase */}
                    <button
                      onClick={increaseQuantity}
                      aria-label="Increase quantity"
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Stock info */}
                <div className="text-right">
                  <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    In Stock
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    15 available
                  </div>
                </div>
              </div>

              {/* Buttons: Add to Cart (primary) and Add to Wishlist (outline) */}
              <div className="mt-4 space-y-3">
                {/* Primary CTA */}
                <button
                  onClick={() => alert(`Added ${quantity} item(s) to cart`)}
                  aria-label={`Add ${quantity} to cart`}
                  className="w-full flex items-center justify-center gap-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                >
                  {/* cart icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6.4A1 1 0 007 21h10a1 1 0 00.98-.804L19 13M7 13H5.4"
                    />
                  </svg>

                  <span className="truncate">Add to Cart</span>

                  <span className="ml-2 font-semibold text-sm whitespace-nowrap">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </button>

                {/* Wishlist CTA */}
                <button
                  onClick={() => alert("Added to wishlist")}
                  aria-label="Add to wishlist"
                  className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 py-3 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
                >
                  {/* heart icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364 4.318 12.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>

                  <span className="truncate">Add to Wishlist</span>
                </button>
              </div>
            </div>
            {/* ---------- end purchase card ---------- */}

            {/* Shipping & returns */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Shipping & Returns
              </h3>
              <ul className="space-y-2 text-slate-600 text-sm list-none">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🚚</span>
                  <span>Free shipping on orders over $50</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🔁</span>
                  <span>30-day return policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🛡️</span>
                  <span>1-year warranty included</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
