"use client";
import styles from "./Filters.module.css";

interface Props {
  search: string;
  setSearch: (s: string) => void;
  category: string;
  setCategory: (c: string) => void;
  categories: string[];
  sort: "default" | "asc" | "desc";
  setSort: (s: "default" | "asc" | "desc") => void;
}

export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
}: Props) {
  return (
    <aside className={styles.container}>
      <div className={styles.top}>
        <div className={styles.group}>
          <label className={styles.label}>Search</label>
          <input
            className={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Sort By</label>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "default" | "asc" | "desc")
            }
          >
            <option value="default">Default</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
            <option value="desc">Price: Highest Rated </option>
          </select>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.designerBadge}>
          <span className={styles.logoDot} />
          <div className={styles.designerText}>
            <div className={styles.designerLabel}>Designed by</div>
            <div className={styles.designerName}>Prince</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
