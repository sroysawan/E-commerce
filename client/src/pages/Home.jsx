import React, { useEffect, useState } from "react";
import ContentCarousel from "../components/home/ContentCarousel";
import BestSeller from "../components/home/BestSeller";
import NewProduct from "../components/home/NewProduct";
import CategoryProduct from "../components/home/CategoryProduct";
import { LayoutDashboard, Rss, SmilePlus } from "lucide-react";
import { FullPageSkeleton } from "../components/ui/Skeletons";
import { mockImagesBanner } from "../utils/mockData";

const preloadImages = (images) => {
  return Promise.all(
    images.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.url;
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
};

const fetchMockData = () => new Promise((resolve) => setTimeout(resolve, 500));

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // รอให้รูปภาพและข้อมูลทุกอย่างโหลดเสร็จพร้อมกัน
        await Promise.all([preloadImages(mockImagesBanner), fetchMockData()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // ปิดสถานะโหลดหลังจากข้อมูลทั้งหมดโหลดเสร็จ
      }
    };

    loadData();
  }, []);

  return isLoading ? (
    <div className="container mx-auto mt-4 md:mt-8 mb-4 md:mb-8 space-y-16">
      <div className="mx-2 md:mx-0 lg:mx-2 xl:mx-0">
        <FullPageSkeleton />
      </div>
    </div>
  ) : (
    <div className="container mx-auto mt-4 md:mt-8 mb-4 md:mb-8 space-y-16">
      <div className="mx-2 sm:mx-2 md:mx-0 lg:mx-2 xl:mx-0">
        <ContentCarousel />
      </div>
      <div className="mx-2 sm:mx-2 md:mx-0 lg:mx-2 xl:mx-0">
        <p className="flex items-center gap-2 text-xl my-4 font-semibold">
          <LayoutDashboard className="fill-blue-500" />
          หมวดหมู่สินค้า
        </p>
        <CategoryProduct />
      </div>
      {/* <div>
      <FullPageSkeleton />
      </div> */}
      <div className="mx-2 sm:mx-2 md:mx-0 lg:mx-2 xl:mx-0">
        <p className="flex items-center gap-2 text-xl my-4 font-semibold">
          <SmilePlus className="fill-green-500 animate-pulse" />
          สินค้าขายดี
        </p>
        <BestSeller />
      </div>
      <div className="mx-2 sm:mx-2 md:mx-0 lg:mx-2 xl:mx-0">
        <p className="flex items-center gap-2 text-xl my-4 font-semibold">
          <Rss className="fill-red-500 animate-pulse" />
          สินค้ามาใหม่
        </p>
        <NewProduct />
      </div>
    </div>
  );
};

export default Home;
