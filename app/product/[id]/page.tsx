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
        <div className="text-slate-600 dark:text-slate-300 animate-pulse">
          Loading...
        </div>
      </div>
    );

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => Math.min(99, q + 1));

  return (
    // Important: add a base text color so children inherit and remain visible in dark mode
    <div className="w-full lg:w-290 mx-auto bg-slate-50 dark:bg-slate-900 pt-15 sm:pt-0 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
            Product Explorer
          </h2>

          <div className="flex flex-wrap items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
            <span className="mx-1 sm:mx-2">›</span>
            <span className="whitespace-nowrap">
              {product.category
                ? product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)
                : "Category"}
            </span>
            <span className="mx-1 sm:mx-2">›</span>
            <span className="whitespace-nowrap truncate max-w-[24ch] sm:max-w-[36ch]">
              {product.title}
            </span>
          </div>
        </div>

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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-12 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Left - Image */}
        <section className="w-full lg:w-1/2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="w-full h-64 sm:h-80 md:h-[420px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
              <Image
                src={product.image ?? "/product-fallback.png"}
                alt={product.title}
                width={1200}
                height={1200}
                className="object-contain max-h-full max-w-full p-2"
                priority
              />
            </div>
          </div>
        </section>

        {/* Right - Info */}
        <aside className="w-full lg:w-1/2">
          <div className="space-y-4 sm:space-y-6">
            {/* Category & Rating */}
            <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-6">
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm md:text-base font-medium">
                {product.category}
              </span>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 text-amber-400 dark:text-amber-500 text-lg sm:text-xl leading-none">
                  {product.rating &&
                    Array.from({ length: 5 }).map((_, i) => {
                      const rate = product.rating?.rate ?? 0;
                      return (
                        <span key={i}>{i < Math.round(rate) ? "★" : "☆"}</span>
                      );
                    })}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {product.rating ? `(${product.rating.rate.toFixed(1)})` : ""}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div className="prose prose-sm sm:prose md:prose-lg dark:prose-invert text-slate-600 dark:text-slate-300">
              <h3 className="text-base sm:text-lg leading-snug">Description</h3>
              <p className="mt-1">{product.description}</p>
            </div>

            {/* Purchase Card (replace this entire block) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Quantity */}
                <div>
                  <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Quantity
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={decreaseQuantity}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      aria-label="decrease quantity"
                    >
                      −
                    </button>

                    {/* make number explicit contrast and set min width with arbitrary value */}
                    <div className="min-w-8 sm:min-w-9 text-center font-semibold text-slate-900 dark:text-slate-100">
                      {quantity}
                    </div>

                    <button
                      onClick={increaseQuantity}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      aria-label="increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Stock Info */}
                <div className="text-right">
                  <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    In Stock
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    15 available
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => alert(`Added ${quantity} item(s) to cart`)}
                  className="w-full bg-[#2563eb] hover:bg-[#1e50c3] text-white font-medium py-3 rounded-lg transition duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 text-sm sm:text-base"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>

                <button
                  onClick={() => alert("Added to wishlist")}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-2.5 sm:py-3 px-3 sm:px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-sm transform hover:-translate-y-0.5 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

            {/* Shipping & Returns */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                Shipping & Returns
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm list-none">
                <li className="flex items-start gap-2">
                  <span>🚚</span>
                  <span>Free shipping on orders over $50</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🔁</span>
                  <span>30-day return policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🛡️</span>
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
