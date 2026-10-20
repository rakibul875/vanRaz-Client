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
