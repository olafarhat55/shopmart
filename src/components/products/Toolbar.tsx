import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search, Filter } from "lucide-react";
import "nprogress/nprogress.css";

export function Toolbar({
  searchInput,
  setSearchInput,
  sort,
  setSort,
  onOpenFilters,
  total,
}: {
  searchInput: string;
  setSearchInput: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  onOpenFilters: () => void;
  total: number;
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black">All Products</h1>
        <p className="text-muted-foreground">
          Showing {total} products
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="pl-9 h-11 rounded-xl"
          />
        </div>

       

        {/* Filters (mobile) */}
        <Button
          variant="outline"
          className="h-11 rounded-xl lg:hidden"
          onClick={onOpenFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
}
