"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import "swiper/css/pagination";

interface HeroSlide {
  subtitle: string;
  title: string;
  price: string;
  image: string;
}

const heroSlides: HeroSlide[] = [
  {
    subtitle: "Best Gadget with Best Price",
    title: "Unbeatable Gadget Combos for Tech Lover",
    price: "$389.99",
    image: "/images/hero/hero_1_1.jpg",
  },
  {
    subtitle: "Favorable Smart Watches",
    title: "Samsung Galaxy Watch6 Aluminum Smart Watch",
    price: "$289.99",
    image: "/images/hero/hero_1_2.jpg",
  },
  {
    subtitle: "Beats Fit Pro",
    title: "Beat True Wireless Noise Cancelling Earbuds",
    price: "$189.99",
    image: "/images/hero/hero_1_3.jpg",
  },
];

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gray-100 mt-10">
      <Image
        src="/assets/hero_bg_1_1.jpg"
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />
      <Swiper
        modules={[Autoplay, Pagination]}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop
        className="hero-swiper"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="min-h-[550px] md:min-h-[600px] lg:min-h-[650px]">
              <div className="mx-auto flex min-h-[550px] max-w-7xl items-center px-5 py-12 sm:px-8 md:min-h-[600px] lg:min-h-[650px] lg:px-10">
                <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
                  {/* Content */}
                  <div className="text-center lg:text-left">
                    <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-white sm:text-base">
                      {slide.subtitle}
                    </span>

                    <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                      <span className="mr-2 text-base font-normal text-white sm:text-lg">
                        From
                      </span>
                      {slide.price}
                    </p>

                    <div className="mt-7">
                      <Link
                        href="/shop"
                        className="inline-flex rounded-lg bg-[#7e22ce] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#7e22ce8f] sm:px-8 sm:py-4 sm:text-base"
                      >
                        START BUYING
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex justify-center lg:justify-end">
                    <div className="relative h-[280px] w-full max-w-[450px] sm:h-[350px] md:h-[400px] lg:h-[480px]">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
