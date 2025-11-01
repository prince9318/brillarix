
// productgrid code
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
    <div className={styles.grid} data-view={viewMode}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} viewMode={viewMode} />
      ))}
    </div>
  );
}
