// app/products/[id]/page.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import type { Product } from "../../../types/product";

type Props = { params: Promise<{ id: string }> };

export default function ProductPage({ params }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // unwrap the params promise using React.use (experimental usage that you had)
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

  if (!product) return <div className="center">Loading...</div>;

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => q + 1);

  return (
    <div className="page-wrap">
      <header className="page-header">
        <div className="brand">Product Explorer</div>
        <div className="breadcrumbs">
          › Electronics › Wireless Bluetooth Headphones
        </div>
      </header>

      <main className="main-grid">
        <section className="image-card">
          <div className="image-inner">
            {/* use remote image with next/image (next.config.js configured). Fallback to local public image */}
            <Image
              src={product.image || "/product-fallback.png"}
              alt={product.title}
              width={900}
              height={900}
              style={{
                objectFit: "contain",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
              onError={(e) => {
                // This won't change src automatically in next/image; fallback handled by src prop above
                // Left here in case you want to switch to <img> fallback later.
              }}
            />
          </div>
        </section>

        <aside className="info-card">
          <div className="category-pill">{product.category}</div>

          <h1 className="title">{product.title}</h1>

          <div className="rating-row">
            <div className="stars">
              {product.rating &&
                Array.from({ length: 5 }).map((_, i) => {
                  const rate = product.rating?.rate ?? 0;
                  if (i < Math.floor(rate)) return <span key={i}>★</span>;
                  if (i < Math.ceil(rate) && rate % 1 !== 0)
                    return <span key={i}>☆</span>;
                  return <span key={i}>☆</span>;
                })}
            </div>
            <div className="rating-number">
              {product.rating ? `(${product.rating.rate.toFixed(1)})` : ""}
            </div>
          </div>

          <div className="price">${product.price.toFixed(2)}</div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="purchase-block">
            <div className="qty-stock-row">
              <div className="quantity-control">
                <label>Quantity</label>
                <div className="qty-controls">
                  <button onClick={decreaseQuantity} className="qty-btn">
                    −
                  </button>
                  <input className="qty-input" readOnly value={quantity} />
                  <button onClick={increaseQuantity} className="qty-btn">
                    +
                  </button>
                </div>
              </div>

              <div className="stock-info">
                <div className="in-stock">In Stock</div>
                <div className="stock-count">15 available</div>
              </div>
            </div>

            <button className="btn-primary">Add to Cart</button>
            <button className="btn-outline">Add to Wishlist</button>
          </div>

          <div className="shipping">
            <h3>Shipping & Returns</h3>
            <ul>
              <li>Free shipping on orders over $50</li>
              <li>30-day return policy</li>
              <li>1-year warranty included</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="site-footer">
        <div>© 2024 Product Explorer. All rights reserved.</div>
        <a className="made-with">Made with Readdy</a>
      </footer>
    </div>
  );
}
