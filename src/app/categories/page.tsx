"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiService } from "@/service/apiService";
import nProgress from "nprogress";
import { ICategory } from "@/interfaces";
import type { Variants } from "framer-motion";

/* ================= Animations ================= */
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

/* ================= Skeleton ================= */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/40 bg-background shadow-sm animate-pulse">
      <div className="h-60 sm:h-70 md:h-100 bg-slate-200/60" />
      <div className="p-4">
        <div className="h-3 w-3/5 bg-slate-200/60 mb-2 rounded" />
        <div className="h-3 w-1/3 bg-slate-200/60 rounded" />
      </div>
    </div>
  );
}

/* ================= Page ================= */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleFetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchCategories();
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
              Browse Categories
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
                {categories?.map((cat) => (
                  <motion.article
                    key={cat._id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-b from-white/2 to-background/2 shadow-lg relative"
                  >
                    <Link
                      href={`/products?categories=${cat._id}`}
                      prefetch={false}
                      className="block"
                    >
                      {/* IMAGE (FIXED) */}
                      <div className="relative h-60 sm:h-70 md:h-100 w-full overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <div className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold truncate">
                            {cat.name}
                          </h3>
                        </div>

                        <div className="flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-90 group-hover:opacity-100"
                          >
                            Explore
                          </Button>
                        </div>
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
