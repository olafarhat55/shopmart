import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiService } from "@/service/apiService";
import HomeHeroSlider from "@/components/home/HomeHeroSlider";
import ItemsCarousl from "@/components/home/ItemsCarousl";
import Currency from "@/components/utils/currency";

import { ICategory, IProduct } from "@/interfaces";
import { ProductsResponse, CategoriesResponse } from "@/types";

export default async function Home() {
  /* ================= Categories ================= */
  let categories: ICategory[] = [];

  try {
    const response: CategoriesResponse =
      await apiService.fetchCategories();

    if (response?.data?.length) {
      categories = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }

  /* ================= Products ================= */
  let products: IProduct[] = [];

  try {
    const response: ProductsResponse =
      await apiService.fetchProducts({
        limit: 4,
        sort: "-ratingsAverage",
      });

    if (response?.data?.length) {
      products = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ================= HERO ================= */}
      <HomeHeroSlider />

      {/* ================= CATEGORIES ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
            Shop by Category
          </h2>
          <p className="text-gray-600 mb-14">
            Explore curated selections tailored for you
          </p>

          <ItemsCarousl categories={categories} />
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <section className="py-24 bg-gray-100/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Trending Products
              </h2>
              <p className="text-gray-600">
                Best sellers this week
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-xl border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              <Link href="/products">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {/* Image */}
                <div className="aspect-square relative rounded-t-xl overflow-hidden">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    loading="lazy"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
                    Hot
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-gray-900">
                      <Currency
                        value={
                          product.priceAfterDiscount ??
                          product.price
                        }
                        currency="EGP"
                      />
                    </span>

                    <div className="flex items-center gap-1 text-gray-700">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {product.ratingsAverage}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
