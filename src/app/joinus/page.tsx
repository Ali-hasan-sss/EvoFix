// src/pages/RegisterTechnicianPage.tsx

"use client";

import React, { useContext } from "react";
import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios"; // استيراد AxiosError
import UserForm from "../../components/forms/UserForm";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie لحفظ التوكن في الكوكيز
import { API_BASE_URL } from "../../utils/api"; // استيراد الدومين من الملف الخارجي
import { RegisterTechnicianData } from "../../utils/types"; // استيراد الواجهة المشتركة

const RegisterTechnicianPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegisterTechnician = async (
    data: RegisterTechnicianData
  ): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users`,
        {
          email: data.email,
          fullName: data.fullName,
          governorate: data.governorate,
          password: data.password,
          phoneNO: data.phoneNO,
          address: data.address,
          specialization: data.specialization, // الاختصاص مطلوب للتقني
          services: data.services, // إضافة وصف الخدمات المطلوبة للتقني
          role: "TECHNICAL", // إضافة دور التقني في الطلب
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const userId = response.data.id;
        const email = response.data.email;
        const userRole = response.data.role;
        const token = response.data.token; // استقبال التوكن من الاستجابة

        // حفظ التوكن في الكوكيز
        Cookies.set("token", token, {
          expires: 7, // حفظ التوكن لمدة 7 أيام
          secure: process.env.NODE_ENV === "production", // يستخدم secure إذا كان الموقع في الإنتاج (HTTPS)
        });

        // حفظ المعرف والبريد الإلكتروني في localStorage
        localStorage.setItem("userId", userId.toString()); // حفظ المعرف كـ string
        localStorage.setItem("email", email);
        localStorage.setItem("userRole", userRole);

        toast.success("تم إنشاء حساب تقني بنجاح!");

        // تسجيل الدخول تلقائيًا
        login(email, userId);

        // إعادة توجيه المستخدم بعد التسجيل
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error("حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error) {
      // استخدام AxiosError للتحقق من نوع الخطأ
      if (error instanceof AxiosError && error.response) {
        toast.error(`حدث خطأ: ${error.response.data.message || "غير معروف"}`);
      } else {
        toast.error("تعذر الاتصال بالخادم");
      }
    }
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`p-8 rounded shadow-md w-full max-w-sm ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">تسجيل حساب تقني جديد</h2>
          <UserForm
            onSubmit={handleRegisterTechnician}
            isNew={true}
            isUser={false}
          />
        </div>
      </div>
    </>
  );
};

export default RegisterTechnicianPage;
