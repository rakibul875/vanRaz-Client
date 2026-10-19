import BestSellers from "@/components/home/BestSellerss";
import Category from "@/components/home/Category";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FlashSale from "@/components/home/FlashSale";
import Hero from "@/components/home/hero";
import TrendingProducts from "@/components/home/TrendingProducts";
import ShopBySmartWatchest from "@/components/home/ShopBySmartWatches";
import ShopByBrand from "@/components/home/ShopByBrand";
import LatestNews from "@/components/home/LatestNew";
import CustomerReviews from "@/components/home/CustomersLatestReviews";
import DeliveryProcess from "@/components/DeliveryProcess";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="bg-[#f7faff] dark:bg-[#0b1325]">
        <div className="container mx-auto ">
          {/* <FlashSale></FlashSale> */}
          <Category />
          <TrendingProducts />

          <FeaturedProducts></FeaturedProducts>

          <BestSellers></BestSellers>
          <ShopBySmartWatchest></ShopBySmartWatchest>
          <ShopByBrand></ShopByBrand>
          <DeliveryProcess></DeliveryProcess>
        </div>
        <CustomerReviews></CustomerReviews>
        <LatestNews></LatestNews>
      </div>
    </div>
  );
}
