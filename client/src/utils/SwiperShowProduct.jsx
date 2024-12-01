import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
const SwiperShowProduct = ({children}) => {
  const swiperRef = useRef(null); // ใช้ useRef สำหรับ Swiper
  const [isSwiperReady, setIsSwiperReady] = useState(false); // state สำหรับเช็คว่า Swiper พร้อมหรือยัง
  const [isBeginning, setIsBeginning] = useState(true); // เช็คว่าอยู่ที่สไลด์แรกหรือไม่
  const [isEnd, setIsEnd] = useState(false); // เช็คว่าอยู่ที่สไลด์สุดท้ายหรือไม่

   // Navigation handlers
   const handlePrev = () => {
    if (isSwiperReady && swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (isSwiperReady && swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };
  return (
    <div className="relative w-full"> {/* ทำให้ Swiper ใช้พื้นที่เต็ม */}
      {/* ปุ่มควบคุมเลื่อนซ้าย */}
      {isSwiperReady && (
        <>
          <button
            className={`hidden md:block absolute -left-5 top-1/2 transform -translate-y-1/2 z-10 
               text-white p-2 rounded-full 
              ${isBeginning ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-600 "}`}
            onClick={handlePrev}
            aria-label="Previous slide"
            disabled={isBeginning} // ปิดใช้งานปุ่มถ้าอยู่สไลด์แรก
          >
            <ArrowLeft />
          </button>

          {/* ปุ่มควบคุมเลื่อนขวา */}
          <button
            className={`hidden md:block absolute -right-5 top-1/2 transform -translate-y-1/2 z-10 
               text-white p-2 rounded-full 
              ${isEnd ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-600 "}`}
            onClick={handleNext}
            aria-label="Next slide"
            disabled={isEnd} // ปิดใช้งานปุ่มถ้าอยู่สไลด์สุดท้าย
          >
            <ArrowRight />
          </button>
        </>
      )}
    <Swiper
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        setIsSwiperReady(true); // เมื่อ Swiper พร้อม ให้ set state
      }}
      onSlideChange={(swiper) => {
        setIsBeginning(swiper.isBeginning); // อัพเดตสถานะสไลด์แรก
        setIsEnd(swiper.isEnd); // อัพเดตสถานะสไลด์สุดท้าย
      }}
      pagination={false}
      slidesPerView={7} // จำนวนสไลด์เริ่มต้น
      spaceBetween={10} // ระยะห่างระหว่างสไลด์เริ่มต้น
      grabCursor={true}
      // loop={true}
      modules={[Pagination, Autoplay, Navigation]}
      // navigation={true}
      // autoplay={{
      //   delay: 5000,
      //   disableOnInteraction: false,
      // }}
      centeredSlides={false} // แสดงสไลด์เรียงต่อกัน ไม่เว้นตรงกลาง
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1280: {
          slidesPerView: 6,
          spaceBetween: 20, // ลดระยะห่างระหว่างสไลด์ที่ขนาดจอใหญ่
        },
      }}
      className="mySwiper object-cover rounded-lg"
    >
      {children}
    </Swiper>

    </div>
);
};

export default SwiperShowProduct;
