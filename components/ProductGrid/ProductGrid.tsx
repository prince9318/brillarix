import styles from "./ProductGrid.module.css";
import { Product } from "../../types/product";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
