"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  id: number;
  avatar: string;
  name: string;
  designation: string;
  review: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    avatar: "/assets/testimonial/testi_2_1.jpg",
    name: "Michel Smith",
    designation: "CEO Of Company",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 2,
    avatar: "/assets/testimonial/testi_2_2.jpg",
    name: "Abraham Khalil",
    designation: "Managing Director",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 3,
    avatar: "/assets/testimonial/testi_2_3.jpg",
    name: "Jenny Wilson",
    designation: "CEO Of Company",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 4,
    avatar: "/assets/testimonial/testi_2_4.jpg",
    name: "Jackline Techie",
    designation: "Managing Director",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 5,
    avatar: "/assets/testimonial/testi_2_5.jpg",
    name: "Michel Smith",
    designation: "CEO Of Company",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
];

export default function CustomerReviews() {
  return (
    <div className="bg-[#FAF5FF] dark:text-white dark:bg-[#0b1325]">
      <section
        id="testi-sec"
        className="relative overflow-hidden  py-16 lg:py-20 px-4 container mx-auto"
      >
        {/* Background Shape */}
        {/* <div className="pointer-events-none absolute left-0 top-0 hidden xl:block ">
          <Image
            src="/assets/img/shape/shape-19.png"
            alt="shape"
            width={250}
            height={250}
            className="animate-bounce opacity-80"
          />
        </div> */}

        {/* Heading Container */}
        <div className="mx-auto max-w-[1860px] px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            {/* Title */}
            <div>
              <h2 className="text-center text-[26px] font-bold leading-tight text-purple-950 dark:text-white sm:text-left sm:text-[30px]">
                Customers Latest Reviews
              </h2>
            </div>

            {/* Explore */}
            <div className="text-center sm:text-right">
              <a
                href="/contact"
                className="inline-block border-b-2 border-purple-700 pb-1 text-[15px] font-semibold text-[#7E22CE] transition hover:border-purple-950 hover:text-purple-950"
              >
                Explore All
              </a>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-5 h-px w-full bg-purple-200/80" />
        </div>

        {/* Slider Container */}
        <div className="mx-auto mt-10 max-w-[1860px] px-5 lg:px-8">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: ".testimonial-pagination",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 18,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1300: {
                slidesPerView: 4,
                spaceBetween: 22,
              },
              1500: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="!py-3"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <div className="flex h-full flex-col justify-between rounded-xl border border-purple-100 bg-white p-6 shadow-sm shadow-purple-900/5 transition-shadow hover:shadow-md hover:shadow-purple-950/10 sm:p-8">
                  <div>
                    {/* Quote + Rating */}
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <Image
                          src="/assets/icon/quote2.svg"
                          alt="Quote"
                          width={36}
                          height={36}
                        />
                      </div>

                      <div
                        className="flex gap-[1px] text-[16px] leading-none text-amber-500"
                        aria-label="Rated 5 out of 5"
                      >
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="mb-6 text-[15px] leading-7 text-purple-900/80">
                      {testimonial.review}
                    </p>
                  </div>

                  {/* Profile Details */}
                  <div className="flex items-center gap-4 border-t border-purple-50 pt-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-purple-100">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-[16px] font-semibold text-purple-950">
                        {testimonial.name}
                      </h3>

                      <p className="mt-0.5 text-[13px] text-purple-400">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Container */}
          <div className="testimonial-pagination mt-8 flex justify-center gap-2" />
        </div>
      </section>
    </div>
  );
}
