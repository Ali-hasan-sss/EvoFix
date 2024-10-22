import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router"; // استيراد useRouter
import Image from "next/image"; // إضافة استيراد Image من next/image
import "./dashboard.css";
import { ThemeContext } from "@/app/ThemeContext";
import { AuthContext } from "@/app/context/AuthContext";
import {
  FaClipboardList,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaChevronUp,
  FaChevronDown,
  FaHome,
} from "react-icons/fa";
import { API_BASE_URL } from "../../utils/api";
import Cookies from "js-cookie";
import axios from "axios";

interface SidebarProps {
  onSelectOption: (option: string) => void;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeOption, setActiveOption] = useState<string>("viewRequests");
  const [isCollapsed, setIsCollapsed] = useState(true); // حالة الطي

  useEffect(() => {
    const token = localStorage.getItem("email");
    setIsLoggedIn(!!token);
    fetchUserData();
    const savedOption = localStorage.getItem("activeOption");
    if (savedOption) {
      setActiveOption(savedOption);
    }
  }, []);

  const handleOptionSelect = (option: string) => {
    setActiveOption(option);
    localStorage.setItem("activeOption", option);
    onSelectOption(option);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("activeOption");
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

  // الصف الرئيسي من شريط التنقل السفلي
  const mainRow = [
    {
      key: "",
      name: "الرئيسية",
      icon: <FaHome className="text-2xl" />,
    },
    {
      key: "viewRequests",
      name: "طلبات الإصلاح",
      icon: <FaClipboardList className="text-2xl" />,
    },
    {
      key: "notifications",
      name: "الإشعارات",
      icon: <FaBell className="text-2xl" />,
    },
    {
      key: "profile",
      name: "الملف الشخصي",
      icon: <FaUser className="text-2xl" />,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <div
        className={`hidden md:flex p-4 flex-col flex-shrink-0 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        }`}
        style={{ width: "250px", minHeight: "100vh", overflowY: "auto" }}
      >
        <div className="space-y-6 sticky top-0">
          <div className="flex items-center justify-between mt-4">
            <Image
              src={
                userData && userData.role === "TECHNICAL"
                  ? "/images/technicalImage.png" // تعديل مسار الصورة هنا
                  : "/images/userImage.png" // تعديل مسار الصورة هنا
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

          {/* استخدام فئات Tailwind لتحديد لون النص */}
          <button
            onClick={() => handleOptionSelect("")}
            className={`flex items-center m-2 mt-3 ${
              activeOption === ""
                ? "bg-blue-600 text-white"
                : isDarkMode
                ? "text-gray-300 hover:bg-blue-400 hover:text-white"
                : "text-black hover:bg-blue-400 hover:text-white"
            } rounded p-2 transition-colors duration-200`}
          >
            <FaHome className="text-2xl ml-2" />
            <span className="mr-2"> الرئيسية</span>
          </button>
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
            <FaUser className="text-2xl ml-2" />
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
      </div>

      {/* شريط التنقل السفلي للشاشات الصغيرة */}
      <div
        className={`fixed bottom-0 left-0 w-full md:hidden z-40 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-blue-600 text-black"
        }`}
      >
        <div className="flex flex-col">
          {/* زر الطي/التوسيع */}
          <div className="flex justify-center p-1 border-t border-gray-300">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-500"
            >
              {isCollapsed ? (
                <FaChevronUp className="text-2xl" />
              ) : (
                <FaChevronDown className="text-2xl" />
              )}
            </button>
          </div>
          {/* الصف الرئيسي من شريط التنقل السفلي */}
          <div className="flex justify-around p-1 border-t border-gray-300">
            {mainRow.map((option) => (
              <button
                key={option.key}
                onClick={() => handleOptionSelect(option.key)}
                className={`flex flex-col items-center flex-1 py-1 ${
                  activeOption === option.key
                    ? "text-yellow-800" // اللون النشط
                    : "text-white" // جعل اللون أبيض في كلا الوضعين
                } transition-colors duration-200`}
                aria-label={option.name}
              >
                {option.icon}
                <span className="text-sm mt-1">{option.name}</span>
              </button>
            ))}
          </div>

          {/* زر تسجيل الخروج في الشريط السفلي */}
          {!isCollapsed && (
            <div className="flex justify-center p-1 border-t border-gray-300">
              <button
                onClick={handleLogout}
                className={`flex flex-col items-center text-red-500 hover:text-red-700 transition-colors duration-200`}
                aria-label="تسجيل الخروج"
              >
                <FaSignOutAlt className="text-2xl" />
                <span className="text-sm mt-1">خروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
