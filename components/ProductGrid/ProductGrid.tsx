// components/ProductGrid/ProductGrid.tsx
import styles from "./ProductGrid.module.css";
import { Product } from "../../types/product";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductGrid({
  products,
  viewMode = "grid",
}: {
  products: Product[];
  viewMode?: "grid" | "list";
}) {
  return (
    <div
      className={styles.grid}
      // you can optionally toggle a CSS class for list mode if you want:
      data-view={viewMode}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} viewMode={viewMode} />
      ))}
    </div>
  );
}
