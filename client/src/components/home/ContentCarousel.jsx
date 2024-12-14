import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { mockImages, mockImagesBanner } from "../../utils/mockData";

const ContentCarousel = () => {
  return (
    <div className="space-y-6">
      <Swiper
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="mySwiper min-w-full md:h-[410px] object-cover rounded-md 
             shadow-md"
      >
        {mockImagesBanner?.map((item, index) => (
          <SwiperSlide key={index}>
            {item ? (
              <img
                src={item.url}
                alt={`Banner ${index + 1}`}
                className="rounded-lg"
              />
            ) : (
              ""
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        // pagination={true}
        slidesPerView={window.innerWidth > 768 ? 5 : 4}
        spaceBetween={10}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="mySwiper object-cover rounded-md"
      >
        {mockImages?.map((item, index) => (
          <SwiperSlide key={index}>
            {item ? (
              <img
                src={item.url}
                alt={`Thumbnail image ${index + 1}`}
                className="rounded-lg"
              />
            ) : (
              ""
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentCarousel;
