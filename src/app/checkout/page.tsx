"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import type { AppDispatch, StoreType } from "@/redux/store";
import { fetchCart as fetchCartThunk } from "@/redux/slices/cartSlice";

import { Button } from "@/components/ui/button";
import Currency from "@/components/utils/currency";

import { apiService } from "@/service/apiService";
import type { ICartData } from "@/interfaces";

import { Loader2, Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import NProgress from "nprogress";

/* ================= TYPES ================= */

type PaymentMethod = "card" | "cash";

/* ================= PAGE ================= */

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const cart: ICartData | null = useSelector(
    (s: StoreType) => s.cart?.cart?.cart ?? null
  );

  const items = cart?.products ?? [];
  const itemsTotal = cart?.totalCartPrice ?? 0;
  const shipping = 0;
  const orderTotal = itemsTotal + shipping;

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    dispatch(fetchCartThunk());
    NProgress.done();
  }, [dispatch]);

  /* ================= DATA ================= */

  const dummyAddress = {
    name: "Default User",
    details: "No address needed",
    city: "N/A",
    phone: "0000000000",
    _id: "default",
  };

  /* ================= ACTIONS ================= */

  const cardCheckout = async () => {
    if (!cart) return;

    const response = await apiService.checkoutSession(
      cart._id,
      dummyAddress
    );

    if (response?.session?.url) {
      window.location.href = response.session.url;
    }
  };

  const cashCheckout = async () => {
    if (!cart) return;

    const response = await apiService.checkoutOnDelivery(
      cart._id,
      dummyAddress
    );

    if (response?.status === "success") {
      router.push("/allorders");
    } else {
      setServerError("Failed to place order.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.products.length === 0) {
      setServerError("Cart is empty.");
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      if (paymentMethod === "card") {
        await cardCheckout();
      } else {
        await cashCheckout();
      }

      setPaid(true);
    } catch (error: unknown) {
      console.error(error);
      setServerError("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen py-12 pt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Checkout
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT ================= */}
          <section className="lg:col-span-2 space-y-4">
            <motion.div layout className="p-4 rounded-2xl shadow-lg border">
              <h2 className="font-semibold mb-3 text-lg">
                Order items
              </h2>

              {items.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Your cart is empty.
                </div>
              ) : (
                <motion.ul layout className="space-y-3">
                  {items.map((it, index) => {
                    const subtotal =
                      (it.price ?? 0) * (it.count ?? 0);

                    return (
                      <motion.li
                        key={it._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-start gap-4 p-3 rounded-lg border bg-secondary/5 hover:shadow-md"
                      >
                        <Image
                          src={it.product.imageCover}
                          alt={it.product.title}
                          width={80}
                          height={80}
                          className="rounded object-cover flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">
                                {it.product.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 truncate">
                                {it.product.category?.name}
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                <Star className="h-4 w-4 text-amber-400" />
                                <span className="text-xs text-muted-foreground">
                                  {it.product.ratingsAverage ?? "—"} (
                                  {it.product.ratingsQuantity ?? 0})
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                <Currency
                                  value={it.price ?? 0}
                                  currency="EGP"
                                />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Count: {it.count}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex justify-between">
                            <div className="text-xs text-muted-foreground truncate">
                              {it.product.description?.slice(0, 120)}…
                            </div>
                            <div className="text-sm font-semibold">
                              <Currency
                                value={subtotal}
                                currency="EGP"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}
            </motion.div>
          </section>

          {/* ================= RIGHT ================= */}
          <aside className="space-y-4">
            <motion.div layout className="p-4 rounded-2xl shadow-lg border">
              <h3 className="font-semibold mb-3 text-lg">
                Order summary
              </h3>

              <div className="text-sm text-muted-foreground space-y-3">
                <div className="flex justify-between">
                  <span>Items subtotal</span>
                  <Currency value={itemsTotal} currency="EGP" />
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping} L.E</span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-2xl">
                    <Currency
                      value={orderTotal}
                      currency="EGP"
                    />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* PAYMENT */}
            <motion.div layout className="p-4 rounded-2xl shadow-lg border">
              <h4 className="font-medium mb-2">
                Payment method
              </h4>

              <div className="space-y-2 mb-4">
                {(["card", "cash"] as PaymentMethod[]).map(
                  (method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-2 rounded-lg border ${
                        paymentMethod === method
                          ? "ring-2 ring-primary/30 bg-secondary/40"
                          : "hover:bg-secondary/20"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === method}
                        onChange={() =>
                          setPaymentMethod(method)
                        }
                      />
                      <span className="font-medium capitalize">
                        {method}
                      </span>
                    </label>
                  )
                )}
              </div>

              {serverError && (
                <div className="text-sm text-red-600 mb-2">
                  {serverError}
                </div>
              )}

              <Button
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
              >
                {paid ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Order Placed
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  "Place order"
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full mt-3"
                onClick={() => router.push("/cart")}
              >
                Back to cart
              </Button>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
