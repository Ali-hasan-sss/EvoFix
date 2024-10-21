// pages/edit-profile.tsx
"use client";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import UserForm from "../../components/forms/UserForm";
import { API_BASE_URL } from "@/utils/api";
interface FormData {
  fullName: string;
  email: string;
  governorate: string;
  password: string;
  confirmPassword: string;
  phoneNO: string;
  address: string;
}

const EditProfilePage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const [initialData, setInitialData] = useState<FormData>({
    fullName: "",
    email: "",
    governorate: "",
    password: "",
    confirmPassword: "",
    phoneNO: "",
    address: "",
  });
  const token = Cookies.get("token");
  useEffect(() => {
    // جلب بيانات المستخدم الحالية من الخادم
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        setInitialData({
          fullName: user.fullName,
          email: user.email,
          governorate: user.governorate,
          password: "",
          confirmPassword: "",
          phoneNO: user.phoneNO,
          address: user.address,
        });
      } catch (error: unknown) {
        toast.error("تعذر جلب بيانات المستخدم");

        // تحقق مما إذا كان الخطأ هو من نوع AxiosError
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            logout();
            router.push("/login");
          }
        } else {
          // هنا يمكنك التعامل مع الأخطاء الأخرى التي ليست من Axios إذا لزم الأمر
          console.error("Unexpected error:", error);
        }
      }
    };

    if (token) {
      fetchUserData();
    } else {
      router.push("/login");
    }
  }, [token, logout, router]);

  const handleEditProfile = async (data: FormData) => {
    try {
      const updateData: Partial<FormData> = { ...data };
      // إزالة كلمات المرور إذا لم يتم تغييرها
      if (!data.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }

      const response = await axios.put(
        "https://evo-fix-api.vercel.app/api/users/me",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث البيانات بنجاح!");
        // يمكن تحديث البيانات المحلية أو إعادة جلبها حسب الحاجة
      } else {
        toast.error("حدث خطأ أثناء تحديث البيانات");
      }
    } catch (error: unknown) {
      // تغيير any إلى unknown
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
          <h2 className="text-xl font-bold mb-4">تعديل البيانات الشخصية</h2>
          <UserForm
            initialData={initialData}
            onSubmit={handleEditProfile}
            submitButtonLabel="تحديث"
          />
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
