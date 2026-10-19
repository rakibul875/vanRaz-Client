"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";

import "swiper/css";

type Brand = {
  id: number;
  image: string;
  name: string;
};

const brands: Brand[] = [
  {
    id: 1,
    image: "/assets/brand/brand_2_1.svg",
    name: "Brand 1",
  },
  {
    id: 2,
    image: "/assets/brand/brand_2_2.svg",
    name: "Brand 2",
  },
  {
    id: 3,
    image: "/assets/brand/brand_2_3.svg",
    name: "Brand 3",
  },
  {
    id: 4,
    image: "/assets/brand/brand_2_4.svg",
    name: "Brand 4",
  },
  {
    id: 5,
    image: "/assets/brand/brand_2_5.svg",
    name: "Brand 5",
  },
  {
    id: 6,
    image: "/assets/brand/brand_2_6.svg",
    name: "Brand 6",
  },
  {
    id: 7,
    image: "/assets/brand/brand_2_1.svg",
    name: "Brand 1",
  },
  {
    id: 8,
    image: "/assets/brand/brand_2_2.svg",
    name: "Brand 2",
  },
  {
    id: 9,
    image: "/assets/brand/brand_2_3.svg",
    name: "Brand 3",
  },
  {
    id: 10,
    image: "/assets/brand/brand_2_4.svg",
    name: "Brand 4",
  },
  {
    id: 11,
    image: "/assets/brand/brand_2_5.svg",
    name: "Brand 5",
  },
  {
    id: 12,
    image: "/assets/brand/brand_2_6.svg",
    name: "Brand 6",
  },
];

const ShopByBrand = () => {
  return (
    <section className="overflow-hidden bg-[#FAF5FF] dark:bg-[#0b1325] py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-center justify-between gap-4 lg:flex-row"
        >
          <div>
            <h2 className="text-center text-2xl font-bold text-purple-950 dark:text-white sm:text-3xl lg:text-left">
              Shop By Brand
            </h2>
          </div>

          <div className="w-full text-center lg:w-auto lg:text-right">
            <Link
              href="/brands"
              className="inline-flex items-center border-b-2 border-purple-700 pb-1 text-sm font-semibold text-[#7E22CE] transition-all duration-300 hover:border-purple-950 hover:text-purple-950"
            >
              Explore All
            </Link>
          </div>
        </motion.div>

        {/* Brand Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Swiper
            spaceBetween={16}
            slidesPerView={2}
            loop={true}
            speed={600}
            breakpoints={{
              576: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 18,
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1300: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
              1500: {
                slidesPerView: 6,
                spaceBetween: 24,
              },
            }}
            className="w-full py-2"
          >
            {brands.map((brand: Brand) => (
              <SwiperSlide key={brand.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group flex h-[135px] items-center justify-center rounded-xl border border-purple-100 bg-white px-4 shadow-sm shadow-purple-900/5 transition-all duration-300 hover:border-purple-300 hover:shadow-md hover:shadow-purple-950/10"
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={200}
                    height={100}
                    className="h-auto max-h-[90px] w-auto max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByBrand;
