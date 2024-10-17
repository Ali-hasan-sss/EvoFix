// components/Sidebar.tsx

"use client";

import React, { useState, useContext, useEffect } from "react";
import "./dashboard.css"; // تأكد من تضمين ملف CSS هنا بدون تعيينات ألوان النصوص
import { ThemeContext } from "@/app/ThemeContext";
import { AuthContext } from "@/app/context/AuthContext"; // استيراد AuthContext
import { FaTools, FaClipboardList, FaBell, FaSignOutAlt } from "react-icons/fa"; // إضافة FaEye
import { API_BASE_URL } from "../../utils/api";
import Cookies from "js-cookie";
import axios from "axios";
import userImage from "../assets/images/userImage.webp";
import technicalImage from "../assets/images/user-solid.svg";
import Image from "next/image";

interface SidebarProps {
  onSelectOption: (option: string) => void;
}
interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  // يمكنك إضافة المزيد من الحقول حسب الحاجة
}
const Sidebar: React.FC<SidebarProps> = ({ onSelectOption }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext); // الحصول على دالة logout
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeOption, setActiveOption] = useState<string>(
    localStorage.getItem("activeOption") || "viewRequests"
  ); // تعيين الخيار النشط

  useEffect(() => {
    const token = localStorage.getItem("email");
    setIsLoggedIn(!!token);
    fetchUserData(); // استدعاء دالة جلب البيانات عند تحميل المكون
  }, []);

  const handleOptionSelect = (option: string) => {
    setActiveOption(option);
    localStorage.setItem("activeOption", option); // حفظ الخيار النشط في localStorage
    onSelectOption(option);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("activeOption"); // إزالة الخيار النشط عند تسجيل الخروج
  };

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");
    if (userId && token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error: unknown) {
        console.error("خطأ في تحميل بيانات المستخدم", error);
      }
    } else {
      console.error("User ID أو token مفقود.");
    }
  };

  return (
    <div className="flex h-full">
      {/* شريط جانبي للشاشات الكبيرة */}
      <div
        className={`hidden md:flex p-4 flex-col h-full flex-shrink-0 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        }`}
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between mt-4">
            <Image
              src={
                userData && userData.role === "TECHNICAL"
                  ? technicalImage
                  : userImage
              }
              alt="Profile"
              width={40} // تعيين عرض الصورة
              height={40} // تعيين ارتفاع الصورة
              className="rounded-full object-cover"
            />
            <span className="ml-4 font-bold">
              {userData ? userData.fullName : "Loading..."}
            </span>
          </div>
        </div>

        {/* استخدام فئات Tailwind لتحديد لون النص */}
        <button
          onClick={() => handleOptionSelect("viewRequests")}
          className={`flex items-center m-2 mt-3 ${
            activeOption === "viewRequests"
              ? "bg-blue-600 text-white"
              : isDarkMode
              ? "text-gray-300 hover:bg-blue-400 hover:text-white"
              : "text-black hover:bg-blue-400 hover:text-white"
          } rounded p-2 transition-colors duration-200`}
        >
          <FaClipboardList className="text-2xl ml-2" />
          <span className="mr-2">طلبات الإصلاح</span>
        </button>
        <button
          onClick={() => handleOptionSelect("notifications")}
          className={`flex items-center m-2 ${
            activeOption === "notifications"
              ? "bg-blue-600 text-white"
              : isDarkMode
              ? "text-gray-300 hover:bg-blue-400 hover:text-white"
              : "text-black hover:bg-blue-400 hover:text-white"
          } rounded p-2 transition-colors duration-200`}
        >
          <FaBell className="text-2xl ml-2" />
          <span className="mr-2">الإشعارات</span>
        </button>
        <button
          onClick={() => handleOptionSelect("profile")}
          className={`flex items-center m-2 ${
            activeOption === "profile"
              ? "bg-blue-600 text-white"
              : isDarkMode
              ? "text-gray-300 hover:bg-blue-400 hover:text-white"
              : "text-black hover:bg-blue-400 hover:text-white"
          } rounded p-2 transition-colors duration-200`}
        >
          <FaTools className="text-2xl ml-2" />
          <span className="mr-2">الملف الشخصي</span>
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className={`flex items-center m-2 text-red-500 hover:text-red-700 rounded p-2 transition-colors duration-200`}
          >
            <FaSignOutAlt className="text-2xl ml-2" />
            <span className="mr-2">تسجيل الخروج</span>
          </button>
        )}
      </div>

      {/* شريط التنقل السفلي للشاشات الصغيرة */}
      <div
        className={`flex md:hidden fixed bottom-0 left-0 w-full justify-around items-center p-2 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        } h-16 z-20`} // إضافة z-20 لضمان ظهور الشريط فوق العناصر الأخرى
      >
        <button
          onClick={() => handleOptionSelect("viewRequests")}
          className={`flex flex-col items-center ${
            activeOption === "viewRequests"
              ? "text-blue-600"
              : isDarkMode
              ? "text-gray-300 hover:text-blue-400"
              : "text-black hover:text-blue-400"
          } transition-colors duration-200`}
        >
          <FaClipboardList className="text-2xl" />
          <span className="text-xs">طلبات الإصلاح</span>
        </button>
        <button
          onClick={() => handleOptionSelect("notifications")}
          className={`flex flex-col items-center ${
            activeOption === "notifications"
              ? "text-blue-600"
              : isDarkMode
              ? "text-gray-300 hover:text-blue-400"
              : "text-black hover:text-blue-400"
          } transition-colors duration-200`}
        >
          <FaBell className="text-2xl" />
          <span className="text-xs">الإشعارات</span>
        </button>
        <button
          onClick={() => handleOptionSelect("profile")}
          className={`flex flex-col items-center ${
            activeOption === "profile"
              ? "text-blue-600"
              : isDarkMode
              ? "text-gray-300 hover:text-blue-400"
              : "text-black hover:text-blue-400"
          } transition-colors duration-200`}
        >
          <Image
            src={
              userData && userData.role === "TECHNICAL"
                ? technicalImage
                : userImage
            }
            alt="Profile"
            width={40} // تعيين عرض الصورة
            height={40} // تعيين ارتفاع الصورة
            className="rounded-full object-cover"
          />

          <span className="text-xs">الملف</span>
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className={`flex flex-col items-center ${"text-red-500 hover:text-red-700"} transition-colors duration-200`}
          >
            <FaSignOutAlt className="text-2xl" />
            <span className="text-xs">خروج</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
