"use client";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types/product";

export default function ProductCard({ product }: { product: Product }) {
  const rate = product.rating?.rate ?? 0;
  const fullStars = Math.floor(rate);
  const hasHalf = rate - fullStars >= 0.5;
  // We'll display up to 5 stars: filled, half (approx), empty.
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < fullStars) return "full";
    if (i === fullStars && hasHalf) return "half";
    return "empty";
  });

  return (
    <article className={styles.card}>
      <Link
        href={`/product/${product.id}`}
        className={styles.media}
        aria-label={product.title}
      >
        <Image
          src={product.image}
          alt={product.title}
          width={500}
          height={500}
          style={{ objectFit: "contain", maxHeight: "100%", minHeight: "100%" }}
        />
      </Link>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{product.title}</h3>
          <span className={styles.categoryTag}>{product.category}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div className={styles.ratingRow}>
            <div className={styles.stars} aria-hidden>
              {stars.map((s, idx) => {
                if (s === "full")
                  return (
                    <span key={idx} className={styles.starFilled}>
                      ★
                    </span>
                  );
                if (s === "half")
                  return (
                    <span key={idx} className={styles.starFilled}>
                      ★
                    </span>
                  ); // keep filled for simplicity
                return (
                  <span key={idx} className={styles.starEmpty}>
                    ★
                  </span>
                );
              })}
            </div>

            <div className={styles.ratingNumber}>
              ({product.rating?.rate ?? "—"})
            </div>
          </div>

          <div className={styles.price}>${product.price.toFixed(2)}</div>
        </div>
      </div>
    </article>
  );
}
