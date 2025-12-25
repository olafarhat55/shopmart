"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import "nprogress/nprogress.css";
import { motion, AnimatePresence } from "framer-motion";

import type { ICategory, IBrand } from "@/interfaces";

import {
  ApiProductsParams,
} from "@/types";

export function FiltersSidebar({
  openMobile,
  setOpenMobile,
  categories,
  brands,
  onApplyFilters,
  onResetFilters,
  updateProductsParams,
}: {
  openMobile: boolean;
  setOpenMobile: (v: boolean) => void;
  categories: ICategory[];
  brands: IBrand[];
  onApplyFilters: () => void;
  onResetFilters: () => void;
  updateProductsParams: (changes: Partial<ApiProductsParams>) => void;
}) {
  // Local state for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  // Local state for collapsible sections
  const [openPrice, setOpenPrice] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);

  // Reset local state when reset is triggered
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    onResetFilters();
  };

  // Apply filters: update global params and close sidebar
  const handleApply = () => {
    const price = new Map();
    if (minPrice !== "" && minPrice !== undefined)
      price.set("gte", Number(minPrice));
    if (maxPrice !== "" && maxPrice !== undefined)
      price.set("lte", Number(maxPrice));
    updateProductsParams({
      categories: selectedCategories,
      brands: selectedBrands,
      price: price.size ? price : undefined,
      page: 1,
    });

    onApplyFilters();
  };

  const Sidebar = (
    <div className="w-full lg:w-80 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={handleReset}
        >
          Clear all
        </Button>
      </div>

      {/* Price Filter */}
      <div className="border border-border/40 rounded-2xl p-6 bg-background">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setOpenPrice((v) => !v)}
        >
          <h3 className="font-semibold">Price</h3>
          {openPrice ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {openPrice && (
            <motion.div
              key="price"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Min</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Max</label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories Filter */}
      <div className="border border-border/40 rounded-2xl p-6 bg-background">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setOpenCategory((v) => !v)}
        >
          <h3 className="font-semibold">Categories</h3>
          {openCategory ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {openCategory && (
            <motion.div
              key="categories"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="space-y-3 max-h-60 overflow-auto">
                {categories.map((c) => {
                  const checked = selectedCategories.includes(c._id);
                  return (
                    <label
                      key={c._id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border"
                        checked={checked}
                        onChange={() =>
                          setSelectedCategories(
                            checked
                              ? selectedCategories.filter((v) => v !== c._id)
                              : [...selectedCategories, c._id]
                          )
                        }
                      />
                      <span className="text-sm">{c.name}</span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brands Filter */}
      <div className="border border-border/40 rounded-2xl p-6 bg-background">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setOpenBrand((v) => !v)}
        >
          <h3 className="font-semibold">Brands</h3>
          {openBrand ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {openBrand && (
            <motion.div
              key="brands"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="space-y-3 max-h-60 overflow-auto pr-1">
                {brands.map((b) => {
                  const checked = selectedBrands.includes(b._id);
                  return (
                    <label
                      key={b._id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border"
                        checked={checked}
                        onChange={() =>
                          setSelectedBrands(
                            checked
                              ? selectedBrands.filter((v) => v !== b._id)
                              : [...selectedBrands, b._id]
                          )
                        }
                      />
                      <span className="text-sm">{b.name}</span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Apply/Reset Buttons */}
      <div className="flex gap-2">
        <Button className="flex-1 rounded-xl" onClick={handleApply}>
          Apply Filters
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{Sidebar}</div>
      {openMobile && (
        <AnimatePresence>
          {openMobile && (
            <motion.div
              key="filters-mobile"
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpenMobile(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />

              {/* sheet: slide from bottom on open, slide down on close */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl p-6 border border-border/40 max-h-[80vh] overflow-auto"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              >
                <div className="flex items-center justify-end mb-4">
                  <Button variant="ghost" onClick={() => setOpenMobile(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {Sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
