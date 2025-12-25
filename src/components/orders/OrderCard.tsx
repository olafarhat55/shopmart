import React, { useState } from "react";
import type { IOrder } from "@/interfaces/order";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Currency from "../utils/currency";

export default function OrderCard({ order }: { order: IOrder }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemsTotal = order.cartItems.reduce(
    (acc, it) => acc + (it.price ?? 0) * it.count,
    0
  );

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      // optional: show toast
    } catch {
      // ignore
    }
  };

  // framer-motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.995 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 6, scale: 0.995 },
  };

  const detailsVariants = {
    collapsed: { height: 0, opacity: 0, transition: { when: "afterChildren" } },
    open: {
      height: "auto",
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.03 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -6 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.li
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      className="bg-secondary/10 shadow-sm rounded-lg overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="font-medium truncate">#{order._id}</div>
              <button
                onClick={() => copyId(order._id)}
                className="text-muted-foreground hover:text-slate-700 ml-2"
                title="Copy order id"
                aria-label="Copy order id"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2 text-sm text-muted-foreground">
              <div>
                <div className="text-xs">Created</div>
                <div className="font-medium">
                  {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
                </div>
              </div>

              <div>
                <div className="text-xs">Payment</div>
                <div className="font-medium capitalize">
                  {order.paymentMethodType}
                </div>
              </div>

              <div>
                <div className="text-xs">Status</div>
                <div className="inline-flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs ${
                      order.isPaid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs ${
                      order.isDelivered
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Not delivered"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <div className="text-xs">Items</div>
                <div className="font-medium">{order.cartItems.length}</div>
              </div>
              <div>
                <div className="text-xs">Items subtotal</div>
                <div className="font-medium">
                  <Currency
                    value={itemsTotal}
                    currency="L.E"
                    direction="ltr"
                    maximumFractionDigits={0}
                    currencySize={1}
                    gap={2}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs">Order total</div>
                <div className="font-semibold text-lg">
                  <Currency
                    value={order.totalOrderPrice}
                    currency="L.E"
                    direction="ltr"
                    maximumFractionDigits={0}
                    currencySize={1}
                    gap={2}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary duration-200 transition-all text-sm"
              onClick={() => setIsOpen((s) => !s)}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {isOpen ? "Hide details" : "Show details"}
            </button>
          </div>
        </div>

        {/* animated details panel */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="details"
              layout
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={detailsVariants}
              className="mt-4 border-t pt-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-semibold mb-2">
                    Shipping address
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <div>{order.shippingAddress?.details}</div>
                    <div>{order.shippingAddress?.city}</div>
                    <div className="mt-1">
                      Phone: {order.shippingAddress?.phone}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold mt-4 mb-2">
                    Payment & timing
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      Method:{" "}
                      <span className="font-medium capitalize">
                        {order.paymentMethodType}
                      </span>
                    </div>
                    <div>
                      Paid:{" "}
                      <span className="font-medium">
                        {order.isPaid ? "Yes" : "No"}
                      </span>
                    </div>
                    {order.paidAt && (
                      <div>
                        Paid at:{" "}
                        <span className="font-medium">
                          {format(new Date(order.paidAt), "yyyy-MM-dd HH:mm")}
                        </span>
                      </div>
                    )}
                    <div>
                      Created:{" "}
                      <span className="font-medium">
                        {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
                      </span>
                    </div>
                    <div>
                      Updated:{" "}
                      <span className="font-medium">
                        {format(new Date(order.updatedAt), "yyyy-MM-dd HH:mm")}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-semibold mb-2">Items</h3>
                  <div className="space-y-3 max-h-60 overflow-auto">
                    {order.cartItems.map((it) => (
                      <motion.div
                        key={it._id}
                        className="flex items-start gap-3"
                        variants={itemVariants}
                      >
                        <img
                          src={it.product.imageCover}
                          alt={it.product.title}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <div className="font-medium truncate">
                              {it.product.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <Currency
                                value={it.price ?? 0}
                                currency="L.E"
                                direction="ltr"
                                maximumFractionDigits={0}
                                currencySize={1}
                                gap={2}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {it.product.brand?.name ?? ""} •{" "}
                            {it.product.category?.name ?? ""}
                          </div>
                          <div className="mt-1 text-sm">
                            Count:{" "}
                            <span className="font-medium">{it.count}</span>
                          </div>
                          <div className="text-sm">
                            Subtotal:{" "}
                            <span className="font-semibold">
                              <Currency
                                value={(it.price ?? 0) * it.count}
                                currency="L.E"
                                direction="ltr"
                                maximumFractionDigits={0}
                                currencySize={1}
                                gap={2}
                              />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-3 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Items total</span>
                      <span>
                        <Currency
                          value={itemsTotal}
                          currency="L.E"
                          direction="ltr"
                          maximumFractionDigits={0}
                          currencySize={1}
                          gap={3}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        <Currency
                          value={order.shippingPrice}
                          currency="L.E"
                          direction="ltr"
                          maximumFractionDigits={0}
                          currencySize={1}
                          gap={3}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>
                        <Currency
                          value={order.taxPrice}
                          currency="L.E"
                          direction="ltr"
                          maximumFractionDigits={0}
                          currencySize={1}
                          gap={3}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2">
                      <span>Total</span>
                      <span>
                        <Currency
                          value={order.totalOrderPrice}
                          currency="L.E"
                          direction="ltr"
                          maximumFractionDigits={0}
                          currencySize={1}
                          gap={3}
                        />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}
