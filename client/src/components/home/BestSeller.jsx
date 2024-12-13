import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductCard from "../cart/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";
const BestSeller = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = () => {

    listProductBy("sold", "desc", 10)
      .then((res) => {
        setData(res.data);
        
      })
      .catch((error) => {
        console.log(error);

      });
  };
  return (
    <>
    {data && data.length > 0 ? ( // ตรวจสอบว่ามีข้อมูลใน data
      <SwiperShowProduct>
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <ProductCard item={item} />
          </SwiperSlide>
        ))}
      </SwiperShowProduct>
    ) : (
      <p className="text-center text-gray-500">ไม่มีสินค้าแนะนำในขณะนี้</p>// ข้อความเมื่อไม่มีข้อมูลและ Skeleton ถูกซ่อน
    )}
  </>
  );
};

export default BestSeller;
