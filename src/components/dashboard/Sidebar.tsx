import React, { useState, useContext, useEffect } from "react";
import "./dashboard.css"; // تأكد من تضمين ملف CSS هنا
import { ThemeContext } from "@/app/ThemeContext";
import { AuthContext } from "@/app/context/AuthContext"; // استيراد AuthContext
import { FaTools, FaClipboardList, FaBell, FaSignOutAlt } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/api";
import Cookies from "js-cookie";
import axios from "axios";
import userImage from "../assets/images/userImage.webp";
import technicalImage from "../assets/images/user-solid.svg";

interface SidebarProps {
  onSelectOption: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext); // الحصول على دالة logout
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
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
        className={`sidebar p-4 flex flex-col h-full flex-shrink-0 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        } `}
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between mt-4">
            <img
              src={
                userData && userData.role === "TECHNICAL"
                  ? technicalImage.src
                  : userImage.src
              }
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="ml-4 font-bold">
              {userData ? userData.fullName : "Loading..."}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleOptionSelect("viewRequests")}
          className={`sidebar-button flex items-center m-2 mt-3 ${
            activeOption === "viewRequests" ? "active" : ""
          }`}
        >
          <FaClipboardList className="text-2xl ml-2" />
          <span className="mr-2">طلبات الإصلاح</span>
        </button>
        <button
          onClick={() => handleOptionSelect("notifications")}
          className={`sidebar-button flex items-center m-2 ${
            activeOption === "notifications" ? "active" : ""
          }`}
        >
          <FaBell className="text-2xl ml-2" />
          <span className="mr-2">الإشعارات</span>
        </button>
        <button
          onClick={() => handleOptionSelect("profile")}
          className={`sidebar-button flex items-center m-2 ${
            activeOption === "profile" ? "active" : ""
          }`}
        >
          <FaTools className="text-2xl ml-2" />
          <span className="mr-2">الملف الشخصي</span>
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="sidebar-button flex items-center m-2"
          >
            <FaSignOutAlt className="text-2xl ml-2" />
            <span className="mr-2 text-red-500">تسجيل الخروج</span>
          </button>
        )}
      </div>
      <div
        className={`bottom-navigation fixed bottom-0 left-0 w-full flex justify-around items-center p-2 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        } h-16`}
      >
        <button
          onClick={() => handleOptionSelect("viewRequests")}
          className={`flex flex-col items-center ${
            activeOption === "viewRequests" ? "active" : ""
          }`}
        >
          <FaClipboardList className="text-2xl" />
        </button>
        <button
          onClick={() => handleOptionSelect("notifications")}
          className={`flex flex-col items-center ${
            activeOption === "notifications" ? "active" : ""
          }`}
        >
          <FaBell className="text-2xl" />
        </button>
        <button
          onClick={() => handleOptionSelect("profile")}
          className={`flex flex-col items-center ${
            activeOption === "profile" ? "active" : ""
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between mt-4">
              <img
                src={
                  userData && userData.role === "TECHNICAL"
                    ? technicalImage.src
                    : userImage.src
                }
                alt="Profile"
                className="w-10 h-10 mb-4 rounded-full object-cover"
              />
            </div>
          </div>
        </button>
        {isLoggedIn && (
          <button onClick={handleLogout} className="flex flex-col items-center">
            <FaSignOutAlt className="text-2xl text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
