import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Slider from "react-slick";
import { API_BASE_URL } from "@/utils/api";
import { Service } from "@/utils/types";

const ServiceSlider: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        setServices(response.data.services);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الخدمات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    nextArrow: null,
    prevArrow: null,
  };

  if (loading) return <div>جارٍ تحميل الخدمات...</div>;

  if (!services || services.length === 0) {
    return <p className="text-center text-gray-500">لا توجد خدمات متاحة.</p>;
  }

  if (services.length === 1) {
    // عرض الخدمة فقط بدون سلايدر إذا كانت هناك خدمة واحدة فقط
    const service = services[0];
    return (
      <div className="relative w-full  sm:w-11/12 md:w-full  mx-auto">
        <Image
          src={service.serviceImage}
          alt={service.title}
          width={800}
          height={400}
          className="rounded-lg object-cover w-full h-[400px]"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-60 p-4 rounded-b-lg">
          <h2 className="text-lg font-bold text-white text-center">
            {service.title}
          </h2>
          <p className="text-sm text-gray-200 text-center">
            {service.description}
          </p>
        </div>
      </div>
    );
  }

  // عرض السلايدر إذا كانت هناك أكثر من خدمة
  return (
    <div className="w-full sm:w-11/12 md:w-full   mx-auto ">
      <Slider {...settings}>
        {services.map((service) => (
          <div key={service.id} className="relative">
            <Image
              src={service.serviceImage}
              alt={service.title}
              width={800}
              height={400}
              className="rounded-lg object-cover w-full h-[400px]"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-60 p-4 rounded-b-lg">
              <h2 className="text-lg font-bold text-white text-center">
                {service.title}
              </h2>
              <p className="text-sm text-gray-200 text-center">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ServiceSlider;
