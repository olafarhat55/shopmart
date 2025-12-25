"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiService } from "@/service/apiService";
import nProgress from "nprogress";
import { IBrand } from "@/interfaces";
import type { Variants } from "framer-motion";

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
  hover: { scale: 1.03, transition: { duration: 0.18 } },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/40 bg-background shadow-sm animate-pulse">
      <div className="h-45 sm:h-40 md:h-50 bg-slate-200/60" />
      <div className="p-4">
        <div className="h-3 w-3/5 bg-slate-200/60 mb-2 rounded" />
        <div className="h-3 w-1/3 bg-slate-200/60 rounded" />
      </div>
    </div>
  );
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<IBrand[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleFetchBrands = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchBrands();
      setBrands(response.data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchBrands();
    nProgress.done();
  }, []);

  return (
    <div className="mt-22 min-h-screen py-12 px-4 md:py-16 bg-gradient-to-b from-background/60 to-background overflow-x-hidden">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Browse Brands
            </h1>
          </motion.div>
        </header>

        <main>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {brands?.map((brand) => (
                  <motion.article
                    key={brand._id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-b from-white/2 to-background/2 shadow-lg"
                  >
                    <Link
                      href={`/products?brands=${brand._id}`}
                      prefetch={false}
                      className="block"
                    >
                      <div className="relative h-45 sm:h-40 md:h-50 w-full overflow-hidden">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          loading="lazy"
                          className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <div className="p-4 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold truncate">
                          {brand.name}
                        </h3>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-90 group-hover:opacity-100"
                        >
                          Explore
                        </Button>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
