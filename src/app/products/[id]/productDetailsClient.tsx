"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Tag,
  Layers,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { IProduct, ISubcategory } from "@/interfaces";
import NProgress from "nprogress";
import AddToCartButton from "@/components/products/AddToCartButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "@/redux/store";
import { Stars } from "@/components/utils/stars";
import WishlistButton from "@/components/products/WishlistButton";
import { findInWishList, toggleWishList } from "@/redux/slices/wishListSlice";

export default function ProductDetailsClient({
  product,
}: {
  product: IProduct;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [descOpen, setDescOpen] = useState(false);

  /* ================= IMAGE FIX (التعديل الوحيد) ================= */
  const images = [
    product.imageCover,
    ...(product.images ?? []),
  ].filter(
    (img): img is string =>
      typeof img === "string" && img.trim().length > 0
  );

  const displayedImages =
    images.length > 0 ? images : ["/placeholder-product.png"];
  /* =============================================================== */

  const brand = product.brand?.name || "No Brand";
  const subcategories: string[] = (product.subcategory ?? []).map(
  (s: ISubcategory) => s?.name ?? String(s)
);


  const price = product.priceAfterDiscount ?? product.price ?? 0;
  const oldPrice = product.priceAfterDiscount ? product.price : null;
  const rating = product.ratingsAverage ?? 0;
  const reviews = product.ratingsQuantity ?? 0;
  const sold = product.sold ?? 0;
  const id = product._id ?? "—";
  const inStock = (product.quantity ?? 0) > 0;
  const description =
    product.description ||
    "No description available for this product. Check back soon for more details!";

  const thumbRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: StoreType) => state.wishlist.wishList);

  const isWished = (productId: string) =>
    findInWishList(wishlist, productId);

  const toggleWish = (product: IProduct) => {
    dispatch(toggleWishList(product));
  };

  useEffect(() => {
    NProgress.done();
    setSelectedImage(0);
  }, [product]);

  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const active = el.children[selectedImage] as HTMLElement | undefined;
    if (!active) return;

    const offset =
      active.offsetLeft -
      el.clientWidth / 2 +
      active.clientWidth / 2;

    el.scrollTo({ left: offset, behavior: "smooth" });
  }, [selectedImage]);

  const nextImage = () =>
    setSelectedImage((i) => (i + 1) % displayedImages.length);

  const prevImage = () =>
    setSelectedImage(
      (i) => (i - 1 + displayedImages.length) % displayedImages.length
    );

  return (
    <div className="mt-22 min-h-screen bg-gradient-to-b from-background via-accent/6 to-background pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ================= LEFT: GALLERY ================= */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="rounded-3xl overflow-hidden relative shadow-xl bg-accent/10">
              <div
                className="relative w-full"
                style={{ aspectRatio: "4 / 3", maxHeight: "70vh" }}
              >
                <Image
                  src={
                    displayedImages[selectedImage] ??
                    "/placeholder-product.png"
                  }
                  alt={product.title || "Product image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />

                <WishlistButton
                  product={product}
                  isWished={isWished}
                  toggle={toggleWish}
                  className="absolute start-5 top-5 scale-130 bg-secondary/50 p-2 rounded-full"
                />
              </div>

              {displayedImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/40 transition"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={nextImage}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/40 transition"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30 flex gap-2">
                    {displayedImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === selectedImage
                            ? "w-6 bg-primary"
                            : "w-1.5 bg-secondary/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ================= THUMBNAILS ================= */}
            <div
              ref={thumbRef}
              className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2"
            >
              {displayedImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-primary ring-2 ring-primary"
                      : "border-border hover:border-primary/60"
                  }`}
                >
                  <Image
                    src={img || "/placeholder-product.png"}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* ================= META PANELS ================= */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border p-4 bg-background">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Brand</div>
                    <div className="font-semibold">{brand}</div>
                  </div>
                  <Tag />
                </div>
              </div>

              <div className="rounded-2xl border p-4 bg-background">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Sold</div>
                    <div className="font-semibold">{sold}</div>
                  </div>
                  <Layers />
                </div>
              </div>

              <div className="rounded-2xl border p-4 bg-background">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Ratings</div>
                    <div className="flex gap-2 items-center">
                      <Stars value={rating} />
                      <span className="font-semibold">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <TrendingUp />
                </div>
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}
            <div className="rounded-2xl border p-6 bg-background">
              <h3 className="font-semibold mb-2">Product details</h3>
              <p
                className={`text-sm text-muted-foreground ${
                  descOpen ? "" : "line-clamp-3"
                }`}
              >
                {description}
              </p>
              <button
                onClick={() => setDescOpen((s) => !s)}
                className="text-primary text-sm mt-2"
              >
                {descOpen ? "Show less" : "Read more"}
              </button>
            </div>
          </motion.div>

          {/* ================= RIGHT: BUY BOX ================= */}
          <motion.aside className="sticky top-24 self-start rounded-2xl border p-6 bg-background shadow-sm">
           <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-muted-foreground text-sm">Price</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl font-extrabold text-primary">
                    ${price}
                  </div>
                  {oldPrice && (
                    <div className="text-sm line-through text-muted-foreground">
                      ${oldPrice}
                    </div>
                  )}
                  {product.priceAfterDiscount && oldPrice && (
                    <div className="ml-auto text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      -
                      {Math.round(((oldPrice - price) / (oldPrice || 1)) * 100)}
                      %
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Availability
                  </div>
                  <div
                    className={`ml-auto text-sm font-semibold ${
                      inStock ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {inStock
                      ? `In stock (${product.quantity})`
                      : "Out of stock"}
                  </div>
                </div>

                {/* quantity & add to cart */}
                <div className="mt-4">
                  {/* isolated buy box component handles add/increase/decrease/remove */}
                  <div className="mt-4">
                    <AddToCartButton
                      id={product._id}
                      productsCount={product.quantity}
                      onCartChange={() => {
                        /* optional hook */
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
