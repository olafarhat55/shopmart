"use client";

import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function ItemsCarousl({
  categories,
}: {
  categories: {name: string; image: string; _id: string}[];
}) {
  return (
    <div className="w-full">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {categories.map((cat) => (
            <CarouselItem key={cat._id} className="basis-1/2 md:basis-1/4">
              <Link
                href={`/products?categories=${encodeURIComponent(cat._id)}`}
                className="group relative overflow-hidden rounded-2xl aspect-square border border-border/40 hover:shadow-lg transition-shadow block"
              >
                <div className="absolute inset-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="relative z-10 flex h-full items-center justify-center">
                  <h3 className="text-xl font-bold text-white backdrop-blur-sm px-4 py-2 rounded-md bg-black/30">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
