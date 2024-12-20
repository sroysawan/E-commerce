import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductCard from "../cart/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";
const BestSeller = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true); // เริ่มโหลดข้อมูล
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await listProductBy("sold", "desc", 10);
      setData(res.data);
    } catch (error) {
      console.error("Error loading best sellers:", error);
    } finally {
      setLoading(false); // จบการโหลดข้อมูล
    }
  };

  return (
    <>
      {loading ? (
        // แสดง Skeleton เมื่อกำลังโหลดข้อมูล
        <SwiperShowProduct>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <SwiperSlide key={`skeleton-${index}`}>
                <ProductCard loading={true}/>
              </SwiperSlide>
            ))}
        </SwiperShowProduct>
      ) : data && data.length > 0 ? ( // ตรวจสอบว่ามีข้อมูลใน data
        <SwiperShowProduct>
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard item={item} />
            </SwiperSlide>
          ))}
        </SwiperShowProduct>
      ) : (
        <p className="text-center text-gray-500">ไม่มีสินค้าแนะนำในขณะนี้</p> // ข้อความเมื่อไม่มีข้อมูลและ Skeleton ถูกซ่อน
      )}
    </>
  );
};

export default BestSeller;
