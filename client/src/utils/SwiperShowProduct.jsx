import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
const SwiperShowProduct = ({children}) => {
  return (
    <div className="w-full"> {/* ทำให้ Swiper ใช้พื้นที่เต็ม */}
    <Swiper
      pagination={false}
      slidesPerView={5} // จำนวนสไลด์เริ่มต้น
      spaceBetween={10} // ระยะห่างระหว่างสไลด์เริ่มต้น
      modules={[Pagination, Autoplay, Navigation]}
      navigation={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
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
          spaceBetween: 10, // ลดระยะห่างระหว่างสไลด์ที่ขนาดจอใหญ่
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
