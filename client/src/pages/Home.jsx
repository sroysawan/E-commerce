import React from "react";
import ContentCarousel from "../components/home/ContentCarousel";
import BestSeller from "../components/home/BestSeller";
import NewProduct from "../components/home/NewProduct";
import CategoryProduct from "../components/home/CategoryProduct";
import { LayoutDashboard, Rss, SmilePlus } from "lucide-react";

const Home = () => {
  return (
    <div className="pt-8 container mb-8 mx-auto space-y-16">
      <div className="mx-2 md:mx-0">
        <ContentCarousel />
      </div>
      <div className="mx-2 md:mx-0">
        <p className="flex items-center gap-2 text-xl my-4 font-semibold">
          <LayoutDashboard className="fill-blue-500" />
          หมวดหมู่สินค้า
        </p>
        <CategoryProduct />
      </div>
      <div className="mx-2 md:mx-0">
        <p className="flex items-center gap-2 text-xl my-4 font-semibold">
          <SmilePlus className="fill-green-500" />
          สินค้าขายดี
        </p>
        <BestSeller />
      </div>
      <div className="mx-2 md:mx-0">
        <p className="flex items-center gap-2 text-xl my-4 font-semibold">
          <Rss className="fill-red-500" />
          สินค้ามาใหม่
        </p>
        <NewProduct />
      </div>
    </div>
  );
};

export default Home;
