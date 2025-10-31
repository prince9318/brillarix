"use client";

import React, { useEffect, useState } from "react";
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
  }, [mode]);

  return (
    <div className="flex items-center gap-2">
      {showLabel && <span className="text-sm text-muted-foreground">View</span>}

      <div className="flex gap-2">
        {/* Grid View Button */}
        <button
          type="button"
          aria-label="Grid view"
          onClick={() => setMode("grid")}
          aria-pressed={mode === "grid"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all
            ${
              mode === "grid"
                ? "border-blue-500 text-blue-500 bg-blue-500/10 shadow"
                : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-400"
            }`}
        >
          <LayoutGrid size={18} />
        </button>

        {/* List View Button */}
        <button
          type="button"
          aria-label="List view"
          onClick={() => setMode("list")}
          aria-pressed={mode === "list"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all
            ${
              mode === "list"
                ? "border-blue-500 text-blue-500 bg-blue-500/10 shadow"
                : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-400"
            }`}
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
}
