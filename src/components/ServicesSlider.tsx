"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "./assets/images/laptop_repair.webp";
interface Service {
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: "خدمة 1",
    description: "وصف الخدمة الأولى.",
    image: "./assets/images/laptop_repair.webp",
  },
  {
    title: "خدمة 2",
    description: "وصف الخدمة الثانية.",
    image: "./assets/images/laptop_repair.webp",
  },
  {
    title: "خدمة 3",
    description: "وصف الخدمة الثالثة.",
    image: "./assets/images/laptop_repair.webp",
  },
  // أضف المزيد من الخدمات حسب الحاجة
];

const ServicesSlider: React.FC = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      loop
    >
      {services.map((service, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col items-center">
            <img
              src={service.image}
              alt={service.title}
              className="w-64 h-64 object-cover mb-4 rounded"
            />
            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-center">{service.description}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServicesSlider;
