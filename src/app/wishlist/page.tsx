"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { IProduct } from "@/interfaces";
import type { AppDispatch, StoreType } from "@/redux/store";
import { fetchWishList, toggleWishList } from "@/redux/slices/wishListSlice";
import AddToCartButton from "@/components/products/AddToCartButton";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/utils/stars";
import { Heart, Trash2 } from "lucide-react";
import Currency from "@/components/utils/currency";
import NProgress from "nprogress";
import { useAuth } from "@/context/AuthContext";
import NotAuthorized from "@/components/auth/notAccessPage";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();

  const dispatch = useDispatch<AppDispatch>();

  const wishState = useSelector(
    (s: StoreType) =>
      s?.wishlist?.wishList ?? {
        isFetching: false,
        firstFetching: false,
        products: [] as IProduct[],
      }
  ) as { isFetching: boolean; firstFetching: boolean; products: IProduct[] };

  const products = Array.isArray(wishState.products) ? wishState.products : [];

  const toggle = (product: IProduct) => dispatch(toggleWishList(product));

  const handleRemove = (product: IProduct) => {
    if (!confirm("Remove this item from your wishlist?")) return;
    toggle(product);
  };

  useEffect(() => {
    NProgress.done();
    if (isAuthenticated) {
      dispatch(fetchWishList());
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <NotAuthorized
        icon={<Heart className="h-10 w-10 text-primary" />}
        title="Sign in to view your wishlist"
        description="You need to be logged in to access your wishlist. Login or create an account to continue."
        primary={{ label: "Login", href: "/login" }}
        secondary={{ label: "Create account", href: "/register" }}
        tertiary={{ label: "Browse", href: "/products" }}
      />
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Your wishlist</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Products you saved for later
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/products")}
            >
              Browse products
            </Button>
          </div>
        </div>

        {wishState.firstFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-border/40 p-8 text-center bg-white dark:bg-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Save items while browsing to find them later.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => (window.location.href = "/products")}>
                Browse products
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((p, idx) => {
              const href = p.id ?? p._id ? `/products/${p.id ?? p._id}` : "#";

              return (
                <article
                  key={p._id}
                  className="flex gap-4 items-stretch bg-secondary/10 border border-border/40 rounded-2xl p-4"
                >
                  <Link
                    href={href}
                    className="shrink-0 w-28 h-28 rounded-lg overflow-hidden bg-accent/10"
                  >
                    <img
                      src={p.imageCover ?? "/placeholder-product.png"}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={href}
                            className="font-semibold hover:text-primary line-clamp-2"
                          >
                            {p.title}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-1">
                            {p.brand?.name ?? "—"} • ID: {p._id ?? "—"}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-extrabold text-primary">
                            <Currency
                              value={
                                p.priceAfterDiscount
                                  ? p.priceAfterDiscount
                                  : p.price ?? 0
                              }
                              direction="rtl"
                            />
                          </div>
                          {p.priceAfterDiscount && (
                            <div className="text-xs text-muted-foreground">
                              <Currency
                                currency=""
                                value={
                                  p.priceAfterDiscount
                                    ? p.priceAfterDiscount
                                    : p.price ?? 0
                                }
                                direction="rtl"
                                className="line-through"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {p.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Stars value={p.ratingsAverage ?? 0} />
                          <span className="text-xs text-muted-foreground">
                            {p.ratingsAverage?.toFixed(1) ?? "0.0"} (
                            {p.ratingsQuantity ?? 0})
                          </span>
                        </div>
                        <span className={`ml-3 text-xs text-muted-foreground`}>
                          {p.quantity && p.quantity > 0
                            ? `In stock (${p.quantity})`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between w-full items-center gap-3">
                      <div className="flex-1 max-w-xs">
                        <AddToCartButton
                          id={p._id}
                          productsCount={p.quantity}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <Button variant="ghost" onClick={() => handleRemove(p)}>
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>

                        <Link href={href}>
                          <Button variant="outline">View</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}