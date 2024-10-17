"use client";

import React, { useEffect, useState, useContext, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import UserForm from "../../components/forms/UserForm"; // استيراد الفورم
import { toast, ToastContainer } from "react-toastify"; // استيراد توست و ToastContainer
import "react-toastify/dist/ReactToastify.css"; // استيراد CSS الخاص بالتوست
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa"; // استيراد الأيقونات
import { confirmAlert } from "react-confirm-alert"; // استيراد مكتبة التأكيد
import "react-confirm-alert/src/react-confirm-alert.css"; // استيراد CSS الخاص بـ react-confirm-alert
import { ThemeContext } from "../ThemeContext";
import { EditProfileData } from "@/utils/types";
import { AuthContext } from "@/app/context/AuthContext";

const Profile: React.FC = () => {
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState<EditProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // حالة الحذف
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState<EditProfileData>({
    fullName: "",
    email: "",
    phoneNO: "",
    password: "",
    confirmPassword: "",
    governorate: "",
    address: "",
    specialization: "",
    role: "",
    isActive: false,
  });

  // تحديد نوع الحساب بناءً على role
  const isUser = userData?.role === "USER";

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "USER":
        return "مستخدم";
      case "TECHNICAL":
        return "تقني";
      case "SUBADMIN":
        return "مسؤول محافظة";
      case "ADMIN":
        return "مسؤول عام";
      default:
        return "غير معروف";
    }
  };

  const fetchUserData = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");
    if (userId && token) {
      setIsLoading(true);
      try {
        const response: AxiosResponse<EditProfileData> = await axios.get(
          `${API_BASE_URL}/users/${userId}`,
          {
            withCredentials: true,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setFormData({
          fullName: response.data.fullName,
          email: response.data.email,
          phoneNO: response.data.phoneNO,
          governorate: response.data.governorate,
          address: response.data.address,
          password: "",
          confirmPassword: "",
          specialization: response.data.specialization || "",
          isActive: response.data.isActive,
          role: response.data.role || "",
        });
      } catch (error: unknown) {
        toast.error("خطأ في تحميل بيانات المستخدم");
        console.log(error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            logout();
            router.push("/login");
          } else {
            toast.error(
              `حدث خطأ: ${error.response.data.message || "غير معروف"}`
            );
          }
        } else {
          toast.error("تعذر الاتصال بالخادم.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("User ID أو token مفقود.");
    }
  }, [setIsLoading, setUserData, setFormData, logout, router]); // ضع هنا التبعيات الفعلية التي يمكن أن تتغير

  const renderUserStatus = () => {
    return (
      <span
        className={`inline-block w-3 h-3 rounded-full ${
          userData?.isActive ? "bg-green-500" : "bg-red-500"
        }`}
        title={userData?.isActive ? "مفعل" : "غير مفعل"}
      ></span>
    );
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUpdate = async (updatedData: EditProfileData) => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");
    if (token && userId) {
      setIsUpdating(true);
      try {
        await axios.put(`${API_BASE_URL}/users/${userId}`, updatedData, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData({ ...userData, ...updatedData });
        setIsEditing(false);
        toast.success("تم تحديث البيانات بنجاح!");
        // إعادة جلب بيانات المستخدم لتحديث الحالة
        fetchUserData();
      } catch (error: unknown) {
        toast.error("حدث خطأ أثناء تحديث البيانات.");
        if (axios.isAxiosError(error) && error.response) {
          toast.error(`حدث خطأ: ${error.response.data.message || "غير معروف"}`);
          console.log(error);
          console.log(isUpdating);
        } else {
          toast.error("تعذر الاتصال بالخادم.");
        }
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error("User ID أو token مفقود.");
    }
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");

    if (token && userId) {
      confirmAlert({
        title: "تأكيد الحذف",
        message: "هل أنت متأكد من أنك تريد حذف حسابك؟",
        buttons: [
          {
            label: "نعم",
            onClick: async () => {
              setIsDeleting(true); // إظهار حالة الحذف
              try {
                await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                  withCredentials: true,
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });
                Cookies.remove("token");
                localStorage.removeItem("email");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRole");
                toast.success("تم حذف الحساب بنجاح!");
                router.push("/login"); // إعادة التوجيه لصفحة تسجيل الدخول
              } catch (error: unknown) {
                toast.error("حدث خطأ أثناء حذف الحساب.");
                console.log(error);
              } finally {
                setIsDeleting(false); // إخفاء حالة الحذف
              }
            },
          },
          {
            label: "لا",
            onClick: () => {},
          },
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
      });
    } else {
      toast.error("User ID أو token مفقود.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userData) {
      setFormData({
        fullName: userData.fullName,
        email: userData.email,
        phoneNO: userData.phoneNO,
        governorate: userData.governorate,
        address: userData.address,
        password: "",
        confirmPassword: "",
        specialization: userData.specialization || "",
        isActive: userData.isActive,
        role: userData.role || "",
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );

  if (!userData) return <div>No data found</div>;

  return (
    <div
      className={`container mx-auto p-4 ${
        isDarkMode ? "bg-gray-900 text-white " : "bg-gray-100 text-black"
      }`}
    >
      <ToastContainer /> {/* إضافة ToastContainer لعرض رسائل التوست */}
      <h1 className="text-3xl font-bold mb-6 text-center">الملف الشخصي</h1>
      {isEditing ? (
        <div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-500 text-white " : "bg-gray-200 text-black"
          }`}
        >
          <div className="flex justify-end">
            <button
              onClick={handleCancelEdit}
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            >
              x
            </button>
          </div>
          <UserForm
            isNew={false}
            isUser={isUser}
            initialData={formData}
            onSubmit={handleUpdate}
          />
        </div>
      ) : (
        <div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {/* عرض بيانات المستخدم مع خلفيات وبوردر لكل عنصر */}
            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border shadow-md flex-1`}
            >
              <p className="font-semibold">:الاسم</p>
              <p className="text-lg">{userData.fullName}</p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border shadow-md flex-1`}
            >
              <p className="font-semibold">:البريد الالكتروني</p>
              <p className="text-lg">{userData.email}</p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border shadow-md flex-1`}
            >
              <p className="font-semibold">الموبايل:</p>
              <p className="text-lg">{userData.phoneNO}</p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border shadow-md flex-1`}
            >
              <p className="font-semibold">:المحافظة</p>
              <p className="text-lg">{userData.governorate}</p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border shadow-md flex-1 lg:col-span-2`}
            >
              <p className="font-semibold">:العنوان</p>
              <p className="text-lg">{userData.address}</p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border shadow-md flex-1`}
            >
              <p className="font-semibold">:نوع الحساب</p>
              <p className="text-lg">{getRoleLabel(userData.role || "")}</p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border shadow-md flex-1`}
            >
              <p className="font-semibold">:الحالة</p>
              <p className="text-lg">{renderUserStatus()}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-between space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600 transition"
            >
              <FaEdit className="ml-2" />
              تعديل
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-400 text-white px-6 py-3 rounded-lg flex items-center hover:bg-red-600 transition"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <FaSpinner className="animate-spin ml-2" />
              ) : (
                <FaTrash className="ml-2" />
              )}
              حذف الحساب
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
