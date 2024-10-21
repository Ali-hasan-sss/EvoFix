// src/pages/RegisterPage.tsx

"use client";

import React, { useContext } from "react";
import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserForm from "../../components/forms/UserForm";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import { RegisterUserData } from "../../utils/types"; // استيراد الواجهة المشتركة

const RegisterPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async (data: RegisterUserData): Promise<void> => {
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
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("email", email);
        localStorage.setItem("userRole", userRole);

        toast.success("تم إنشاء الحساب بنجاح!");

        // تسجيل الدخول تلقائيًا
        login(email, userId);

        // إعادة توجيه المستخدم بعد التسجيل
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error("حدث خطأ أثناء إنشاء الحساب.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `خطأ من الخادم: ${error.response.data.message || "غير معروف"}`
        );
      } else {
        toast.error("تعذر الاتصال بالخادم. حاول مرة أخرى لاحقاً.");
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
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-500 text-gray-800"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">تسجيل حساب جديد</h2>
          <UserForm onSubmit={handleRegister} isNew={true} isUser={true} />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
