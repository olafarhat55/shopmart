"use client";

import React, { useEffect, useMemo, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { motion } from "framer-motion";

import type { IProduct, ICategory, IBrand } from "@/interfaces";
import { apiService } from "@/service/apiService";
import {
  ApiProductsParams,
  CategoriesResponse,
  ProductsResponse,
} from "@/types";

import {
  ProductCard,
  ProductCardSkeleton,
  Toolbar,
  FiltersSidebar,
  Pagination,
} from "@/components";

import { AppDispatch, StoreType } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { findInWishList, toggleWishList } from "@/redux/slices/wishListSlice";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<string>("-sold");
  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [productsParams, setProductsParams] = useState<ApiProductsParams>({
    page: 1,
  });

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  /* ================= Wishlist ================= */
  const wishlist = useSelector((state: StoreType) => state.wishlist.wishList);
  const isWished = (productId: string) =>
    findInWishList(wishlist, productId);

  const toggleWish = (product: IProduct) => {
    dispatch(toggleWishList(product));
  };

  /* ================= Progress ================= */
  useEffect(() => {
    isLoading ? NProgress.start() : NProgress.done();
  }, [isLoading]);

  /* ================= URL Params ================= */
  const updateProductsParams = (changes: Partial<ApiProductsParams>) => {
    const newParams = { ...productsParams, ...changes };
    setProductsParams(newParams);

    const search = new URLSearchParams();

    if (newParams.page) search.set("page", String(newParams.page));
    if (newParams.categories?.length)
      search.set("categories", newParams.categories.join(","));
    if (newParams.brands?.length)
      search.set("brands", newParams.brands.join(","));

    router.replace(`/products?${search.toString()}`);
  };

  const resetProductsParams = () => {
    setProductsParams({ page: 1 });
    router.replace("/products");
  };

  /* ================= Fetch meta ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      const res: CategoriesResponse = await apiService.fetchCategories();
      setCategories(res.data);
    };

    const fetchBrands = async () => {
      const res = await apiService.fetchBrands();
      setBrands(res.data);
    };

    fetchCategories();
    fetchBrands();
  }, []);

  /* ================= Fetch products ================= */
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const filterParams: ApiProductsParams = {};

    params.forEach((value, key) => {
      if (!value) return;

      switch (key) {
        case "page":
          filterParams.page = Number(value);
          break;

        case "categories":
          filterParams.categories = value.split(",");
          break;

        case "brands":
          filterParams.brands = value.split(",");
          break;

      
      }
    });

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res: ProductsResponse =
          await apiService.fetchProducts(filterParams);

        setProducts(res.data);
        setTotalPages(res.metadata?.numberOfPages ?? 1);
      } catch {
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  /* ================= Grid ================= */
  const containerClass =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Toolbar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          sort={sort}
          setSort={setSort}
          onOpenFilters={() => setOpenMobileFilters(true)}
          total={products.length}
        />

        <div className="mt-8 flex lg:gap-8">
          <FiltersSidebar
            openMobile={openMobileFilters}
            setOpenMobile={setOpenMobileFilters}
            categories={categories}
            brands={brands}
            onApplyFilters={() => setOpenMobileFilters(false)}
            onResetFilters={resetProductsParams}
            updateProductsParams={updateProductsParams}
          />

          <div className="flex-1">
            <motion.div className={containerClass}>
              {isFirstLoad
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : products.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      isWished={isWished}
                      toggleWish={toggleWish}
                    />
                  ))}
            </motion.div>

            <Pagination
              page={productsParams.page || 1}
              pages={totalPages}
              onChange={updateProductsParams}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
