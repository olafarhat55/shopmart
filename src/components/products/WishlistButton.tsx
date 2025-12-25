"use client";

import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { IProduct } from "@/interfaces";
import { useAuth } from "@/context/AuthContext";

interface Props {
  product: IProduct;
  className?: string;
  isWished: (productId: string) => boolean;
  toggle: (product: IProduct) => void;
}

export default function WishlistButton({ className = "", product, isWished, toggle }: Props) {
  const wished = isWished(product._id);

  const {authProcess} = useAuth();

  return (
    <button
      aria-pressed={wished}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      onClick={ () => {authProcess(() => toggle(product))} }
      className={`relative ${className} flex justify-center align-center`}
      title={wished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <div>
        <span
          key={wished ? "on" : "off"}
          className="flex items-center justify-center w-5 h-5"
        >
          <Heart
            className={`transition-colors duration-200 ${
              wished
                ? "text-rose-500 fill-rose-500"
                : "text-slate-600 dark:text-slate-300"
            }`}
            size={18}
          />
          {wished && (
            <motion.span
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute rounded-full bg-rose-500/20 pointer-events-none"
            >
              <Heart className="text-rose-500 fill-rose-500" size={18} />
            </motion.span>
          )}
        </span>
      </div >
    </button>
  );
}
