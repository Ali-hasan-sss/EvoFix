// ServiceSlider.tsx
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
    dots: true, // عرض النقاط
    infinite: true, // التمرير اللانهائي
    speed: 500, // سرعة الانتقال
    slidesToShow: 1, // عدد الشرائح المعروضة
    slidesToScroll: 1, // عدد الشرائح التي يتم تمريرها عند النقر
    autoplay: true, // التمرير التلقائي
    autoplaySpeed: 3000, // سرعة التمرير التلقائي
    swipeToSlide: true, // دعم السحب
    nextArrow: null, // إخفاء زر التالي
    prevArrow: null, // إخفاء زر السابق
  };

  if (loading) return <div>جارٍ تحميل الخدمات...</div>;

  return (
    <div className="w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/3 mx-auto my-4">
      <Slider {...settings}>
        {services.map((service) => (
          <div key={service.id} className="relative">
            <Image
              src={service.serviceImage}
              alt={service.title}
              width={640} // استخدم العرض المطلوب للصورة
              height={256} // استخدم الارتفاع المطلوب للصورة
              className="rounded-lg object-cover"
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
