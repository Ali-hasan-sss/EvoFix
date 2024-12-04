"use client";
import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import { ThemeContext } from "@/app/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import {
  FaClock,
  FaDollarSign,
  FaEye,
  FaPlusCircle,
  FaRegSmile,
  FaTools,
} from "react-icons/fa";
import Link from "next/link";

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <section id="about">
      <div
        className={` px-4 py-20 text-center about ${
          isDarkMode ? "dark-bg-1" : "light-bg-1 "
        }`}
      >
        <h3 className="text-3xl font-semibold mb-8">من نحن</h3>

        <p className="text-lg max-w-2xl mx-auto mb-8">
          نحن خبراء في إصلاح الأجهزة الإلكترونية، نقدم خدمات سريعة وموثوقة
          وبأسعار معقولة. مع فريق مهاري وأجزاء عالية الجودة، نضمن أن جهازك سيعود
          إليك في حالة ممتازة. منصتنا توفر تجربة سلسة لإصلاح مختلف الأجهزة
          الإلكترونية، ونعطي الأولوية لرضا العملاء من خلال التواصل الواضح
          والشفافية والالتزام بالجودة.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* الميزة 1: سرعة التنفيذ */}
          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaClock className="text-4xl mb-4 " />
            <h4 className="text-xl font-semibold mb-4">سرعة التنفيذ</h4>
            <p>
              نحن نعلم أهمية الوقت. لذلك نضمن وقت تنفيذ سريع بحيث يمكنك العودة
              لاستخدام جهازك بأسرع وقت ممكن.
            </p>
          </div>

          {/* الميزة 2: فنيون ذوي خبرة */}
          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaTools className="text-4xl mb-4" />
            <h4 className="text-xl font-semibold mb-4">فنيون ذوي خبرة</h4>
            <p>
              فريقنا يتكون من فنيين ذوي خبرة، متخصصين في تشخيص وإصلاح مجموعة
              واسعة من المشاكل الإلكترونية، من إصلاح الشاشات إلى استبدال
              البطاريات.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
          {/* الميزة 3: أسعار معقولة */}
          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaDollarSign className="text-4xl mb-4 " />
            <h4 className="text-xl font-semibold mb-4">أسعار معقولة</h4>
            <p>
              نقدم أسعارًا تنافسية دون المساومة على جودة الإصلاحات. هيكل التسعير
              الشفاف يضمن أنه لا توجد رسوم خفية.
            </p>
          </div>

          {/* الميزة 4: أجزاء عالية الجودة */}
          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaTools className="text-4xl mb-4 " />
            <h4 className="text-xl font-semibold mb-4">أجزاء عالية الجودة</h4>
            <p>
              نستخدم فقط الأجزاء عالية الجودة لضمان أن جهازك يعمل بشكل ممتاز كما
              كان في حالته الجديدة.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
          {/* الميزة 5: رضا العملاء */}
          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaRegSmile className="text-4xl mb-4 " />
            <h4 className="text-xl font-semibold mb-4">رضا العملاء</h4>
            <p>
              رضا العملاء هو أولويتنا الأولى. نحن ملتزمون بضمان أنك راضٍ عن
              الإصلاحات، ونقدم ضمانات على جميع خدماتنا.
            </p>
          </div>

          {/* الميزة 6: سهولة التتبع */}
          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaEye className="text-4xl mb-4 " />
            <h4 className="text-xl font-semibold mb-4">سهولة التتبع</h4>
            <p>
              منصتنا تتيح لك تتبع حالة إصلاح جهازك بسهولة، حتى تعرف دائمًا متى
              يمكنك استلامه.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
          {/*زر لاستعراض خدمات الموقع*/}
          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaEye className="text-4xl mb-4 " />
            <h4 className="text-xl font-semibold mb-4">استعرض جميع الخدمات</h4>
            <Link href="/services">
              <button
                className={` ${
                  isDarkMode
                    ? "text-white shadow-dark"
                    : "text-black shadow-light"
                } btn mt-4`}
              >
                تصفح خدماتنا
              </button>
            </Link>
          </div>
          {/*زر للانضمام الى الفريق*/}

          <div
            className={`md:w-1/2 w-full p-6 rounded-lg  text-center ${
              isDarkMode ? "shadow-dark" : "shadow-light"
            }`}
          >
            <FaPlusCircle className="text-4xl mb-4 " />
            <h4 className="text-xl font-semibold mb-4">هل انت تقني ؟ </h4>
            <Link href="/joinus">
              <button
                className={` ${
                  isDarkMode
                    ? "text-white shadow-dark"
                    : "text-black shadow-light"
                } btn mt-4`}
              >
                انضم الى فريقنا{" "}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
