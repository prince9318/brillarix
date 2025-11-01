// components/ViewToggle.tsx
"use client";

import React, { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "list";

type Props = {
  initial?: ViewMode;
  onChange?: (mode: ViewMode) => void;
  showLabel?: boolean;
  storageKey?: string;
  /**
   * If true, the toggle will align to the right on small screens (mobile),
   * and keep normal alignment on sm+.
   */
  rightAlignOnMobile?: boolean;
};

export default function ViewToggle({
  initial,
  onChange,
  showLabel = false,
  storageKey = "product_view_mode",
  rightAlignOnMobile = true,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, mode);
    }
    onChange?.(mode);
  }, [mode, onChange, storageKey]);

  // container classes:
  // - on mobile: w-full and justify-end (right aligned)
  // - on sm+: keep inline/left behavior (sm:justify-start)
  const containerClass = [
    "w-full",
    "flex",
    "items-center",
    "gap-2",
    "md:gap-3",
    "lg:gap-4",
    "flex-wrap",
    rightAlignOnMobile ? "justify-end sm:justify-start" : "justify-start",
  ].join(" ");

  const buttonBase =
    "flex items-center justify-center rounded-lg border transition-all h-11 w-11 sm:h-9 sm:w-9 md:h-10 md:w-10 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400";

  return (
    <div className={containerClass}>
      {showLabel && (
        <span className="text-sm text-muted-foreground hidden sm:inline-block whitespace-nowrap mr-2">
          View
        </span>
      )}

      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        <button
          type="button"
          aria-label="Grid view"
          onClick={() => setMode("grid")}
          aria-pressed={mode === "grid"}
          className={`${buttonBase} ${
            mode === "grid"
              ? "border-blue-500 text-blue-500 bg-blue-500/10 shadow"
              : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-400"
          }`}
        >
          <LayoutGrid className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </button>

        <button
          type="button"
          aria-label="List view"
          onClick={() => setMode("list")}
          aria-pressed={mode === "list"}
          className={`${buttonBase} ${
            mode === "list"
              ? "border-blue-500 text-blue-500 bg-blue-500/10 shadow"
              : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-400"
          }`}
        >
          <List className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </button>
      </div>
    </div>
  );
}
