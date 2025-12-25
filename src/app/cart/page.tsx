"use client";

import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteProduct,
  increment,
  decrement,
  fetchCart,
} from "@/redux/slices/cartSlice";
import { AppDispatch, StoreType } from "@/redux/store";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import Currency from "@/components/utils/currency";
import { useAuth } from "@/context/AuthContext";
import NotAuthorized from "@/components/auth/notAccessPage";

/* ================= Animations ================= */
const listVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: {
    opacity: 0,
    x: 80,
    scale: 0.92,
    rotate: 4,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const SkeletonItem = ({ index }: { index: number }) => (
  <motion.div
    key={`skeleton-${index}`}
    className="flex items-center gap-4 rounded-2xl border border-border/40 p-4 bg-background shadow-sm animate-pulse"
  >
    <div className="h-20 w-20 rounded-lg bg-slate-200/60" />
    <div className="flex-1">
      <div className="h-4 w-3/5 bg-slate-200/60 rounded mb-2" />
      <div className="h-3 w-1/3 bg-slate-200/60 rounded" />
    </div>
  </motion.div>
);

/* ================= Page ================= */
export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const cart = useSelector((state: StoreType) => state.cart.cart.cart);
  const isFetchingCart = useSelector(
    (state: StoreType) => state.cart.cart.isFetching
  );
  const firstFetching = useSelector(
    (state: StoreType) => state.cart.cart.firstFetching
  );

  const prevFetchingRef = useRef<boolean | null>(null);
  const [skipEnterAnimations, setSkipEnterAnimations] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  /* ================= Fetch Cart ================= */
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    NProgress.done();
    if (prevFetchingRef.current === true && isFetchingCart === false) {
      setSkipEnterAnimations(true);
    }
    prevFetchingRef.current = isFetchingCart;
  }, [isFetchingCart]);

  useLayoutEffect(() => {
    if (!skipEnterAnimations) return;
    const raf = requestAnimationFrame(() => setSkipEnterAnimations(false));
    return () => cancelAnimationFrame(raf);
  }, [skipEnterAnimations]);

  /* ================= Calculations ================= */
  const subtotal = useMemo(
    () =>
      cart?.products
        ? cart.products.reduce(
            (acc, item) => acc + (item.price ?? 0) * item.count,
            0
          )
        : 0,
    [cart]
  );

  const handleRemove = (id: string) => {
    dispatch(deleteProduct(id));
  };

  /* ================= Not Auth ================= */
  if (!isAuthenticated) {
    return (
      <NotAuthorized
        icon={<ShoppingCart className="h-10 w-10 text-primary" />}
        title="Sign in to view your cart"
        description="You need to be logged in to access your cart."
        primary={{ label: "Login", href: "/login" }}
        secondary={{ label: "Create account", href: "/register" }}
        tertiary={{ label: "Browse products", href: "/products" }}
      />
    );
  }

  /* ================= UI ================= */
  return (
    <div className="mt-22 min-h-screen py-16 bg-gradient-to-b from-background/60 to-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold">Your Cart</h1>
          <p className="text-sm text-muted-foreground">
            {cart?.products?.length ?? 0} items
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Products */}
          <section className="md:col-span-2 space-y-4">
            {firstFetching ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonItem key={i} index={i} />
              ))
            ) : !cart || cart.products.length === 0 ? (
              <div className="rounded-2xl border p-8 text-center">
                <p className="mb-4">Your cart is empty</p>
                <Link href="/products">
                  <Button>Browse products</Button>
                </Link>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {cart.products.map((item) => {
                  const p = item.product;
                  const image =
                    p?.imageCover ||
                    p?.images?.[0] ||
                    "/placeholder-product.png";

                  return (
                    <motion.article
                      key={item._id}
                      variants={listVariants}
                      initial="hidden"
                      animate="enter"
                      exit="exit"
                      className="flex items-center gap-4 rounded-2xl border p-4 bg-background shadow-sm"
                    >
                      {/* IMAGE (FIXED) */}
                      <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted/10">
                        <img
                          src={image}
                          alt={p?.title ?? "Product"}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <Link
                          href={`/products/${p?._id}`}
                          className="font-semibold block"
                        >
                          {p?.title}
                        </Link>
                        <Currency value={item.price ?? 0} currency="EGP" />

                        {/* Controls */}
                        <div className="mt-3 flex items-center gap-3">
                          <Button
                            size="icon"
                            onClick={() => dispatch(decrement(item._id))}
                            disabled={item.count <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="font-semibold">
                            {item.count}
                          </span>

                          <Button
                            size="icon"
                            onClick={() => dispatch(increment(item._id))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            )}
          </section>

          {/* Summary */}
          <aside className="rounded-2xl border p-6 bg-background">
            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <Currency value={subtotal} currency="EGP" />
            </div>

            <Button
              className="w-full"
              disabled={!cart || cart.products.length === 0}
              onClick={() => {
                setCheckoutLoading(true);
                NProgress.start();
                router.push("/checkout");
              }}
            >
              {checkoutLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Checkout
                </>
              )}
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
