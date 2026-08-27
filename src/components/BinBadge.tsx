import React from "react";
import type { WasteCategory } from "../data/wasteItems";
import { CATEGORY_META } from "../data/categoryMeta";

interface BinBadgeProps {
  category: WasteCategory;
  showIcon?: boolean;
}

export const BinBadge: React.FC<BinBadgeProps> = ({ category, showIcon = true }) => {
  const meta = CATEGORY_META[category];
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border tracking-wide uppercase transition-all duration-200 ${meta.colorClass}`}
    >
      {showIcon && <span>{meta.emoji}</span>}
      <span>{meta.label}</span>
    </span>
  );
};
