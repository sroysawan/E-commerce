import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductCard from "../cart/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";

const NewProduct = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {

    listProductBy("createdAt", "desc", 30) // ดึงข้อมูลจำนวนมาก
    .then((res) => {
      const products = res.data;

      // สินค้าใหม่ในช่วง 30 วัน
          //ถ้าไม่มีสินค้าในช่วง 30 วัน ระบบจะแสดงสินค้าล่าสุด 7 ชิ้น เพื่อไม่ให้หน้าแสดงผลโล่ง
      const thirtyDaysAgo = new Date(); //ตัวแปรที่เก็บวันที่ 15 วันที่ผ่านมา
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 15); //ใช้ setDate เพื่อลดวันที่ในตัวแปร thirtyDaysAgo ลง 15 วัน
      //ตัวแปรที่เก็บสินค้าในช่วง 30 วัน , ใช้ filter ตรวจสอบว่า createdAt ของสินค้าอยู่ในช่วง 30 วันหรือไม่
      const filteredProducts = products.filter(
        (product) => new Date(product.createdAt) >= thirtyDaysAgo
      );

      let finalProducts; //ตัวแปรเก็บสินค้าสำหรับการแสดงผล

      if (filteredProducts.length >= 10) {
        // ถ้าสินค้าใหม่ใน 30 วันมี >= 10 ชิ้น แสดงทั้งหมด
        finalProducts = filteredProducts;
      } else {
        // ถ้าสินค้าใหม่ใน 30 วันมีไม่ถึง 10 ชิ้น
        // เติมสินค้าที่เก่ากว่าให้ครบ 7 ชิ้น
        const remainingProducts = products.filter(
          (product) =>
            !filteredProducts.some((fp) => fp.id === product.id) // กรองสินค้าไม่ให้ซ้ำ
        );
        finalProducts = [
          ...filteredProducts,
          ...remainingProducts.slice(0, 10 - filteredProducts.length), //เติมสินค้าจาก remainingProducts ให้ครบ 7 ชิ้น
        ];
      }

      setData(finalProducts);
    })
    .catch((error) => {
      console.log(error);
    });
};
  //     .then((res) => {
  //       const products = res.data;
  //       const thirtyDaysAgo = new Date();
  //       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 1);

  //       // สินค้าในช่วง 30 วัน
  //       const filteredProducts = products.filter(
  //         (product) => new Date(product.createdAt) >= thirtyDaysAgo
  //       );

  //       // ถ้าสินค้าที่อยู่ในช่วง 30 วันมีไม่ถึง 10 ชิ้น ให้เติมสินค้าล่าสุดเข้าไป
  //       let finalProducts = filteredProducts.slice(0, 10); // เริ่มต้นด้วยสินค้าในช่วง 30 วัน
  //       if (finalProducts.length < 10) {
  //         const remainingProducts = products.filter(
  //           (product) => !finalProducts.some((p) => p.id === product.id) // กรองสินค้าไม่ให้ซ้ำ
  //         );
  //         finalProducts = [...finalProducts, ...remainingProducts.slice(0, 10 - finalProducts.length)];
  //       }

  //       setData(finalProducts);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
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
        <p className="text-center text-gray-500">ไม่มีสินค้าแนะนำในขณะนี้</p> // ข้อความเมื่อไม่มีข้อมูลและ Skeleton ถูกซ่อน
      )}
    </>

    //   <SwiperShowProduct >
    //   {
    //     data?.map((item) =>
    //       <SwiperSlide key={item.id}>
    //         <ProductCard item={item} />
    //       </SwiperSlide>
    //     )
    //   }
    // </SwiperShowProduct>

    // <SwiperShowProduct>
    //    {showSkeleton || isLoading
    //     ? Array(6)
    //         .fill(0)
    //         .map((_, index) => (
    //           <SwiperSlide key={index}>
    //             <ProductCard key={index} loading />
    //           </SwiperSlide>
    //         ))
    //     : data?.map((item, index) => (
    //         <SwiperSlide key={item.id}>
    //           <ProductCard key={index} item={item} loading={isLoading} />
    //         </SwiperSlide>
    //       ))}
    // </SwiperShowProduct>
  );
};

export default NewProduct;
