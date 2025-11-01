"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "list";

type Props = {
  initial?: ViewMode;
  onChange?: (mode: ViewMode) => void;
  showLabel?: boolean;
  storageKey?: string;
};

export default function ViewToggle({
  initial,
  onChange,
  showLabel = false,
  storageKey = "product_view_mode",
}: Props) {
  const [mode, setMode] = useState<ViewMode>("grid");

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (saved === "grid" || saved === "list") {
      setMode(saved);
    } else if (initial) {
      setMode(initial);
    }
  }, [initial, storageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, mode);
    }
    onChange?.(mode);
  }, [mode, onChange, storageKey]);

  return (
    <div
      className="
        flex items-center
        gap-2
        md:gap-3
        lg:gap-4
        /* allow wrapping on very small screens so layout doesn't break */
        flex-wrap
      "
    >
      {/* Label: hidden on small screens to save space, shown on sm+ if requested */}
      {showLabel && (
        <span className="text-sm text-muted-foreground hidden sm:inline-block whitespace-nowrap">
          View
        </span>
      )}

      <div
        className="
          flex items-center
          gap-1 sm:gap-2 md:gap-3
        "
      >
        {/* Grid View Button */}
        <button
          type="button"
          aria-label="Grid view"
          onClick={() => setMode("grid")}
          aria-pressed={mode === "grid"}
          className={`flex items-center justify-center
            rounded-lg border transition-all
            /* ensure minimum touch target (44px) for small devices */
            h-11 w-11 sm:h-9 sm:w-9 md:h-10 md:w-10
            min-h-11 min-w-11
            /* compact visually on very small screens */
            sm:leading-none
            ${
              mode === "grid"
                ? "border-blue-500 text-blue-500 bg-blue-500/10 shadow"
                : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-400"
            }
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400
          `}
        >
          {/* icon scales responsively */}
          <LayoutGrid className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </button>

        {/* List View Button */}
        <button
          type="button"
          aria-label="List view"
          onClick={() => setMode("list")}
          aria-pressed={mode === "list"}
          className={`flex items-center justify-center
            rounded-lg border transition-all
            h-11 w-11 sm:h-9 sm:w-9 md:h-10 md:w-10
            min-h-11 min-w-11
            ${
              mode === "list"
                ? "border-blue-500 text-blue-500 bg-blue-500/10 shadow"
                : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-400"
            }
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400
          `}
        >
          <List className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </button>
      </div>
    </div>
  );
}
