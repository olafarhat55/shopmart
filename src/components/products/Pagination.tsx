import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "nprogress/nprogress.css";

import {
  ApiProductsParams,
} from "@/types";

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (changes: Partial<ApiProductsParams>) => void;
}) {
  if (pages <= 1) return null;
  const getPageNumbers = () => {
    const items: (number | string)[] = [];
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    items.push(1);
    if (page > 3) items.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(pages - 1, page + 1);
      i++
    ) {
      items.push(i);
    }
    if (page < pages - 2) items.push("...");
    items.push(pages);
    return items;
  };
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Button
        variant="outline"
        size="icon"
        className="rounded-xl"
        disabled={page <= 1}
        onClick={() => onChange({ page: page - 1 })}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {getPageNumbers().map((n, i) =>
        typeof n === "string" ? (
          <span key={i} className="px-2">
            {n}
          </span>
        ) : (
          <Button
            key={n}
            variant={n === page ? "default" : "outline"}
            size="icon"
            className="rounded-xl"
            onClick={() => onChange({ page: n as number })}
          >
            {n}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="icon"
        className="rounded-xl"
        disabled={page >= pages}
        onClick={() => onChange({ page: page + 1 })}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}