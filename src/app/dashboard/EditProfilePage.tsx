import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import UserForm from "../../components/forms/UserForm";
import { getData, putData } from "@/utils/axiosInstance"; // استيراد الدوال من ملف axiosInstance
import axios, { AxiosError } from "axios";

// تعريف واجهة لبيانات المستخدم
interface UserData {
  fullName: string;
  email: string;
  governorate: string;
  phoneNO: string;
  address: string;
}

// تعريف واجهة لبيانات النموذج
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
    const fetchUserData = async () => {
      try {
        const user = await getData<UserData>("/users/me"); // استدعاء الدالة مع نوع UserData
        setInitialData({
          fullName: user.fullName,
          email: user.email,
          governorate: user.governorate,
          password: "",
          confirmPassword: "",
          phoneNO: user.phoneNO,
          address: user.address,
        });
      } catch (error) {
        toast.error("تعذر جلب بيانات المستخدم");
        // هنا نتحقق من نوع الخطأ
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            logout();
            router.push("/login");
          }
        }
        console.error("Unexpected error:", error);
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

      if (!data.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }

      await putData("/users/me", updateData); // استدعاء الدالة الجديدة
      toast.success("تم تحديث البيانات بنجاح!");
    } catch (error) {
      console.error("Error updating profile:", error);
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
