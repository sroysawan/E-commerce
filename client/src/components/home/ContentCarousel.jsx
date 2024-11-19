import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import Skeleton from 'react-loading-skeleton'
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
import { Pagination,Autoplay,Navigation } from "swiper/modules";
import { mockImages,mockImagesBanner } from '../../utils/mockData'

const ContentCarousel = () => {
  // const [picture, setPicture] = useState([]);
  // const [picture, setPicture] = useState(mockImages); // ใช้ mock data
  // const images = Array.from({ length: 15 }, () => `https://picsum.photos/400/300?random=${Math.random()}`);
  // const imagesBanner = Array.from( { length: 15 }, (_, i) => `https://picsum.photos/800/410?random=${i + 1}`
  // );
  // useEffect(() => {
  //   handleGetImage();
  // }, []);

  // const handleGetImage = () => {
  //    axios.get("https://picsum.photos/v2/list?page=1&limit=15")
  //     .then((res) => {
  //       console.log(res.data)
  //       setPicture(res.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
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
        className="mySwiper min-w-full md:h-[410px] object-cover rounded-md 
             shadow-md">
        {mockImagesBanner?.map((item,index) => (
            <SwiperSlide key={index}>
            {item ? (
              <img src={item.url} loading="lazy" className="rounded-lg" />

            ) : (
              <Skeleton height={200} />
            )}
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
        {mockImages?.map((item,index) => (
            <SwiperSlide key={index}>
            {item ? (
              <img src={item.url} loading="lazy" className="rounded-lg" />

            ) : (
              <Skeleton height={200} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentCarousel;
