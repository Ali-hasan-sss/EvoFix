import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import "./dashboard.css";
import BottomNavbar from "./BottomNavbar"; // استيراد المكون الجديد
import { ThemeContext } from "@/app/ThemeContext";
import { AuthContext } from "@/app/context/AuthContext";
import {
  FaClipboardList,
  FaBell,
  FaUser,
  FaSignOutAlt,
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
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("email");
    setIsLoggedIn(!!token);
    fetchUserData();
    fetchNotificationsCount();
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

  const fetchNotificationsCount = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/notifications/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotificationsCount(response.data.count); // تحديث حالة عدد الإشعارات
      } catch (error: unknown) {
        console.error("خطأ في جلب عدد الإشعارات", error);
      }
    }
  };

  useEffect(() => {
    fetchNotificationsCount();

    const intervalId = setInterval(fetchNotificationsCount, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const mainRow = [
    {
      key: "viewHome",
      name: "الرئيسية",
      icon: <FaHome className="text-2xl" />,
    },
    {
      key: "viewRequests",
      name: "طلبات الإصلاح",
      icon: <FaClipboardList className="text-2xl" />,
    },
    {
      key: "Invoices",
      name: "الفواتير",
      icon: <FaClipboardList className="text-2xl" />,
    },
    {
      key: "notifications",
      name: "الإشعارات",
      icon: (
        <div className="relative">
          <FaBell className="text-2xl" />
          {notificationsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
              {notificationsCount}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "profile",
      name: "الملف الشخصي",
      icon: <FaUser className="text-2xl" />,
    },
  ];

  const sidebarRow = mainRow.filter((option) => option.key !== "viewHome");

  return (
    <div className="flex min-h-screen mt-4 text-white">
      <div
        className={`hidden md:flex p-4 flex-col flex-shrink-0 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-600"
        }`}
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <div className="space-y-6 sticky top-0">
          <div className="flex items-center mt-4">
            <Image
              src={
                userData && userData.role === "TECHNICAL"
                  ? "/images/technicalImage.png"
                  : "/images/userImage.png"
              }
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="ml-4 font-bold mr-4">
              {userData ? userData.fullName : "Loading..."}
            </span>
          </div>

          {sidebarRow.map((option) => (
            <button
              key={option.key}
              onClick={() => handleOptionSelect(option.key)}
              className={`flex items-center m-2 mt-3 ${
                activeOption === option.key
                  ? "bg-blue-600 text-white"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-blue-400 hover:text-white"
                  : "text-white hover:bg-blue-400 hover:text-white"
              } rounded p-2 transition-colors duration-200`}
            >
              {option.icon}
              <span className="mr-2">{option.name}</span>
            </button>
          ))}

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

      <BottomNavbar
        mainRow={mainRow}
        activeOption={activeOption}
        handleOptionSelect={handleOptionSelect}
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Sidebar;
