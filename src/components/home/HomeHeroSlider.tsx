"use client";

import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "Summer Sale",
    offer: "Up to 50% OFF",
    description:
      "Upgrade your lifestyle with premium products at unbeatable prices.",
    image: "/images/hero/hero-1.jpg",
  },
  {
    id: 2,
    title: "New Arrivals",
    
    description:
      "Discover the latest arrivals carefully curated just for you.",
    image: "/images/hero/hero-2.jpg",
  },
  {
    id: 3,
    title: "Exclusive Deals",
   
    description:
      "Don’t miss exclusive offers available for a short time only.",
    image: "/images/hero/hero-3.jpg",
    },
    {
    id: 4,
    title: "Exclusive Deals",
    
    description:
      "Don’t miss exclusive offers available for a short time only.",
    image: "/images/hero/hero-4.jpg",
  },
];

export default function HomeHeroSlider() {
  return (
    <section className="relative w-full pt-24">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4500,
            stopOnInteraction: false,
          }),
        ]}
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[60vh] min-h-[420px] w-full">

                {/* Optimized Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="relative z-10 flex h-full items-center justify-center text-center">
                  <div className="px-4 max-w-2xl space-y-6 text-white">

                   

                    <h1 className="text-3xl md:text-5xl font-extrabold">
                      {slide.title}
                    </h1>

                    <p className="text-base md:text-lg text-white/90">
                      {slide.description}
                    </p>

                    <div className="flex justify-center gap-4 pt-6">
                      <Button
                        asChild
                        size="lg"
                        className="h-14 px-10 rounded-2xl bg-white/25 text-white backdrop-blur-md border border-white/30 hover:bg-white/35"
                      >
                        <Link href="/products">Shop Now</Link>
                      </Button>

                      <Button
                        asChild
                        size="lg"
                        className="h-14 px-10 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/30 hover:bg-white/20"
                      >
                        <Link href="/products">View Products</Link>
                      </Button>
                    </div>

                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
