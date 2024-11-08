import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
const SwiperShowProduct = ({children}) => {
  return (
    <div>
      <Swiper
        pagination={false}
        slidesPerView={5}
        spaceBetween={10}
        modules={[Pagination, Autoplay, Navigation]}
        navigation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 50,
            },
          }}
        className="mySwiper  object-cover rounded-lg"
      >
        {children}
      </Swiper>
    </div>
  );
};

export default SwiperShowProduct;
