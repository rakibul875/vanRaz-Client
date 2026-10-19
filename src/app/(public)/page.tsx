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
import HomePage from "@/components/home/Home";
import LoadingPage from "../loading";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<LoadingPage></LoadingPage>}>
        <HomePage></HomePage>
      </Suspense>
    </div>
  );
}
