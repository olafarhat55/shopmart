"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch, Star } from "lucide-react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { motion } from "framer-motion";

import AddToCartButton from "@/components/products/AddToCartButton";
import WishlistButton from "@/components/products/WishlistButton";
import Currency from "../utils/currency";
import { IProduct } from "@/interfaces";
import IconLoadingImage from "../IconLoadingImage";

/* ================= TYPES ================= */

type ProductCardProps = {
  product: IProduct;
  isWished: (productId: string) => boolean;
  toggleWish: (product: IProduct) => void;
};

/* ================= COMPONENT ================= */

export function ProductCard({
  product,
  isWished,
  toggleWish,
}: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [product.imageCover, ...(product.images ?? [])].filter(
    Boolean
  ) as string[];

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      setCurrentImage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const startLoader = () => NProgress.start();

  /* ================= UI ================= */

  return (
    <motion.article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-xl overflow-hidden bg-secondary/10 h-full border border-border/40 hover:shadow-md transition shadow-sm flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative aspect-square bg-accent/10">
        <Link href={`/products/${product._id}`} onClick={startLoader}>
          <motion.div
            className="absolute inset-0 h-full flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="w-full h-full flex-shrink-0 relative overflow-hidden"
              >
                <IconLoadingImage
                  height={400}
                  width={400}
                  src={img}
                  alt={`${product.title}-${i}`}
                  className="object-cover w-full h-full"
                  icon={PackageSearch}
                />
              </div>
            ))}
          </motion.div>
        </Link>

        {/* WISHLIST */}
        <div className="absolute top-2 right-2 bg-white/70 dark:bg-black/40 backdrop-blur-sm p-1.5 rounded-full shadow">
          <WishlistButton
            product={product}
            isWished={isWished}
            toggle={toggleWish}
          />
        </div>

        {/* PRICE BADGE */}
        <div className="absolute left-2 bottom-2 px-2 py-1 rounded-full bg-primary text-white text-xs font-semibold shadow">
          <Currency value={product.price} currency="EGP" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium line-clamp-1">
            {product.category?.name}
          </span>
          <span className="text-xs flex items-center gap-1 text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.ratingsAverage?.toFixed(1) ?? "0.0"}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-2 flex-1">
          <Link
            href={`/products/${product._id}`}
            onClick={startLoader}
            className="text-sm font-semibold line-clamp-2 hover:text-primary"
          >
            {product.title}
          </Link>

          <AddToCartButton
            id={product._id}
            productsCount={product.quantity}
          />
        </div>
      </div>
    </motion.article>
  );
}
