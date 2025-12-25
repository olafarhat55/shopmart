"use client";

import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Loader2,
  Package,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  deleteProduct,
  increment,
  decrement,
  fetchCart,
} from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, StoreType } from "@/redux/store";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import Currency from "@/components/utils/currency";
import { useAuth } from "@/context/AuthContext";
import NotAuthorized from "@/components/auth/notAccessPage";

const listVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
  exit: {
    opacity: 0,
    x: 80,
    scale: 0.92,
    rotate: 4,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const SkeletonItem = ({ keyIndex }: { keyIndex: number }) => (
  <motion.div
    key={`skeleton-${keyIndex}`}
    layout
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.28 }}
    className="flex items-center gap-4 rounded-2xl border border-border/40 p-4 bg-background shadow-sm animate-pulse"
  >
    <div className="h-20 w-20 rounded-lg bg-slate-200/60" />
    <div className="flex-1 min-w-0">
      <div className="h-4 w-3/5 rounded bg-slate-200/60 mb-2" />
      <div className="h-3 w-1/3 rounded bg-slate-200/60 mb-4" />
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-slate-200/60" />
        <div className="min-w-[56px] h-5 rounded bg-slate-200/60" />
        <div className="h-9 w-9 rounded-md bg-slate-200/60" />
        <div className="ml-4 h-9 w-9 rounded-md bg-slate-200/60" />
      </div>
    </div>
  </motion.div>
);

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: StoreType) => state.cart.cart.cart);
  const isFetchingCart = useSelector(
    (state: StoreType) => state.cart.cart.isFetching
  );
  const CartLoading = useSelector(
    (state: StoreType) => state.cart.cart.firstFetching
  );

  const { isAuthenticated } = useAuth();

  const prevFetchingRef = useRef<boolean | null>(null);
  const [skipEnterAnimations, setSkipEnterAnimations] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    NProgress.done();
    if (prevFetchingRef.current === true && isFetchingCart === false) {
      setSkipEnterAnimations(true);
    }
    prevFetchingRef.current = isFetchingCart;
  }, [CartLoading]);

  useLayoutEffect(() => {
    if (!skipEnterAnimations) return;
    const raf = requestAnimationFrame(() => {
      setSkipEnterAnimations(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [skipEnterAnimations]);

  // remove with AnimatePresence exit animation
  const handleRemove = (cartProductId: string) => {
    dispatch(deleteProduct(cartProductId));
  };

  const subtotal = useMemo(
    () =>
      cart?.products
        ? cart.products.reduce((acc, it) => acc + (it.price ?? 0) * it.count, 0)
        : 0,
    [cart]
  );

  
  if (!isAuthenticated) {
    return (
      <NotAuthorized
        icon={<ShoppingCart className="h-10 w-10 text-primary" />}
        title="Sign in to view your cart"
        description="You need to be logged in to access your cart. Login or create an account to continue."
        primary={{ label: "Login", href: "/login" }}
        secondary={{ label: "Create account", href: "/register" }}
        tertiary={{ label: "Browse", href: "/products" }}
      />
    );
  }

  return (
    <div className="mt-22 min-h-screen py-16 bg-gradient-to-b from-background/60 to-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-3 md:flex md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-2xl font-extrabold">Your cart</h1>
            <p className="text-sm text-muted-foreground">
              {cart?.products?.length ?? 0} item
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              <span>Updated: </span>
              <time dateTime={cart?.updatedAt ?? ""}>
                {cart?.updatedAt
                  ? new Date(cart.updatedAt).toLocaleString()
                  : "—"}
              </time>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/products" onClick={() => NProgress.start()}>
                Continue shopping
              </Link>
            </Button>

            <Button size="sm" className="flex items-center gap-2" disabled>
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Button>
          </div>
        </motion.header>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="md:col-span-2 space-y-4">
            {CartLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonItem keyIndex={i} key={`s-${i}`} />
                ))}
              </>
            ) : !cart || cart.products.length === 0 ? (
              <motion.div
                key="empty"
                variants={listVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
                className="rounded-2xl border border-border/40 p-8 text-center bg-background"
              >
                <div className="text-lg font-semibold mb-2">
                  Your cart is empty
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Add some products to your cart to get started.
                </p>
                <Link href="/products" onClick={() => NProgress.start()}>
                  <Button>Browse products</Button>
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {cart.products.map((it) => {
                  const p = it.product;
                  const image =
                    p?.imageCover ??
                    p?.images?.[0] ??
                    "/placeholder-product.png";
                  return (
                    <motion.article
                      layout
                      key={it._id}
                      variants={listVariants}
                      initial="hidden"
                      animate="enter"
                      exit="exit"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 12px 30px rgba(2,6,23,0.08)",
                      }}
                      transition={{
                        layout: {
                          duration: 0.28,
                          type: "spring",
                          stiffness: 320,
                          damping: 28,
                        },
                      }}
                      className="flex items-center gap-4 rounded-2xl border border-border/40 p-4 bg-background shadow-sm"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted/6">
                        <Image
                          src={image}
                          alt={p?.title ?? it._id}
                          fill
                          className="object-cover"
                        />
                        </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${p?._id}`}
                              onClick={() => NProgress.start()}
                              className="font-semibold truncate line-clamp-2"
                              
                            >
                              {p?.title ?? `Product ${p?._id ?? it._id}`}
                            </Link>
                            <div className="text-sm text-muted-foreground">
                              {p?.brand?.name ? `${p.brand.name} • ` : ""}
                              ID: {p?._id ?? it._id}
                            </div>
                          </div>

                          <div className="text-right ml-2">
                            <div className="font-semibold">
                              <Currency
                                value={it.price ?? 0}
                                currency="EGP"
                                maximumFractionDigits={2}
                              />
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {it.count > 1 ? (
                                <Currency
                                  value={(it.price ?? 0) * it.count}
                                  currency="EGP"
                                  maximumFractionDigits={2}
                                />
                              ) : (
                                <>-</>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                          <Button
                            className={`h-9 w-9 rounded-md border bg-background flex text-primary hover:text-secondary items-center justify-center`}
                            onClick={() => dispatch(decrement(it._id))}
                            disabled={it.count <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <div className="min-w-[56px] text-center font-semibold">
                            {/* <Input
                              value={it.count}
                              className="text-center w-fit"
                              ref={InputRef}
                              type="number"
                              
                            /> */}
                            {it.count}
                          </div>

                          <Button
                            className="h-9 w-9 rounded-md border bg-background flex text-primary hover:text-secondary items-center justify-center"
                            onClick={() => dispatch(increment(it._id))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-4"
                            aria-label="Remove"
                            onClick={() => handleRemove(it._id)}
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

          <aside className="rounded-2xl border border-border/40 p-6 bg-background">
            <div className="mb-4">
              <div className="text-sm text-muted-foreground">Order summary</div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-sm">Subtotal</div>
                <div className="text-lg font-semibold">
                  <Currency
                    value={subtotal}
                    currency="EGP"
                    maximumFractionDigits={2}
                  />
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="flex items-center justify-center gap-2 "
                disabled={
                  !cart || cart.products.length === 0 || checkoutLoading
                }
                onClick={() => {
                  NProgress.start();
                  router.push("/checkout");
                }}
              >
                {checkoutLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Checkout
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                Continue shopping
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-xs text-muted-foreground"
            >
              <div className="mb-1">Need help?</div>
              <div>Contact support or read our shipping & returns policy.</div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
