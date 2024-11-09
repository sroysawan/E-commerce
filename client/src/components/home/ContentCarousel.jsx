import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
import { Pagination,Autoplay,Navigation } from "swiper/modules";
const ContentCarousel = () => {
  const [picture, setPicture] = useState([]);

  useEffect(() => {
    handleGetImage();
  }, []);

  const handleGetImage = () => {
     axios.get("https://picsum.photos/v2/list?page=1&limit=15")
      .then((res) => {
        // console.log(res.data);
        setPicture(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="space-y-6">
      <Swiper 
        pagination={{
          clickable: true,
        }}
        modules={[Pagination,Autoplay]} 
        autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        className="mySwiper min-w-full h-[410px] object-cover rounded-md 
             shadow-xl shadow-black">
        {picture?.map((item,index) => (
            <SwiperSlide key={index}>
                <img src={item.download_url} />
            </SwiperSlide>
        ))}
      </Swiper>
      <Swiper 
        pagination={true} 
        slidesPerView={5}
        spaceBetween={10}
        modules={[Pagination,Autoplay,Navigation]} 
        navigation={true}
        autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        className="mySwiper object-cover rounded-md">
        {picture?.map((item,index) => (
            <SwiperSlide key={index}>
                <img src={item.download_url} className="rounded-lg "/>
            </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentCarousel;
