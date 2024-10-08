// pages/register.tsx
"use client";
import React, { useContext } from "react";
import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserForm from "../../components/forms/UserForm";
import { API_BASE_URL } from "../../utils/api"; // استيراد الدومين من الملف الخارجي

const RegisterPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async (data: {
    fullName: string;
    email: string;
    governorate: string;
    password: string;
    confirmPassword: string;
    phoneNO: string;
    address: string;
    specialization?: string; // إضافة الاختصاص كاختياري
  }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users`, // استخدام الدومين من الملف الخارجي
        {
          email: data.email,
          fullName: data.fullName,
          governorate: data.governorate,
          password: data.password,
          phoneNO: data.phoneNO,
          address: data.address,
          specialization: data.specialization, // إضافة الاختصاص للطلب
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Data:", response.data); // للتأكد من البيانات المستلمة

      if (response.status === 200 || response.status === 201) {
        const userId = response.data.id;
        const email = response.data.email;
        const userRole = response.data.role;

        // حفظ المعرف والبريد الإلكتروني في localStorage
        localStorage.setItem("userId", userId.toString()); // حفظ المعرف كـ string
        localStorage.setItem("email", email);
        localStorage.userRole("userRole", userRole);

        toast.success("تم إنشاء الحساب بنجاح!");

        // تمرير token كـ null لأنه غير مستخدم
        login(email, userId); // تحديث AuthContext بالبريد الإلكتروني ومعرف المستخدم

        // إعادة توجيه المستخدم بعد التسجيل
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error("حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
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
          <h2 className="text-xl font-bold mb-4">تسجيل حساب جديد</h2>
          <UserForm
            onSubmit={handleRegister}
            isNew={true} // تمرير القيمة isNew كـ true
            isUser={true} // تمرير القيمة isUser كـ true، إذا كنت تريد استخدامه كـ مستخدم عادي
          />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
