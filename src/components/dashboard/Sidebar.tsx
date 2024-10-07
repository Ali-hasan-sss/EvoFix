// src/components/Sidebar.tsx
import React, { useState, useContext, useEffect } from "react";
import "./dashboard.css"; // تأكد من تضمين ملف CSS هنا
import profil from "./ali.png";
import { ThemeContext } from "@/app/ThemeContext";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext"; // استيراد AuthContext
import { FaTools, FaClipboardList, FaBell, FaSignOutAlt } from "react-icons/fa";

interface SidebarProps {
  onSelectOption: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext); // الحصول على دالة logout
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const token = localStorage.getItem("email");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    logout(); // استدعاء دالة logout
  };

  return (
    <div>
      {/* شريط جانبي للمستخدمين على الشاشات الكبيرة */}
      <div
        className={`sidebar fixed right-0 top-20 p-4 flex flex-col justify-between ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        } h-full`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <img
              src={profil.src}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="ml-4 font-bold">Ali Hasan</span>
          </div>
          <button
            onClick={() => onSelectOption("viewRequests")}
            className="sidebar-button flex items-center"
          >
            <FaClipboardList className="text-2xl" />
            <span className="ml-4">طلبات الإصلاح</span>
          </button>
          <button
            onClick={() => onSelectOption("notifications")}
            className="sidebar-button flex items-center"
          >
            <FaBell className="text-2xl" />
            <span className="ml-4">الإشعارات</span>
          </button>
          <button
            onClick={() => onSelectOption("profile")}
            className="sidebar-button flex items-center"
          >
            <FaTools className="text-2xl" />
            <span className="ml-4">الملف الشخصي</span>
          </button>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="sidebar-button flex items-center"
            >
              <FaSignOutAlt className="text-2xl" />
              <span className="ml-4">تسجيل الخروج</span>
            </button>
          )}
        </div>
      </div>

      {/* شريط التنقل السفلي للمستخدمين على الشاشات الصغيرة */}
      <div
        className={`bottom-navigation  ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        } h-16`}
      >
        <button
          onClick={() => onSelectOption("viewRequests")}
          className="flex flex-col items-center"
        >
          <FaClipboardList className="text-2xl" />
        </button>
        <button
          onClick={() => onSelectOption("notifications")}
          className="flex flex-col items-center"
        >
          <FaBell className="text-2xl" />
        </button>
        <button
          onClick={() => onSelectOption("profile")}
          className="flex flex-col items-center"
        >
          <FaTools className="text-2xl" />
        </button>
        {isLoggedIn && (
          <button onClick={handleLogout} className="flex flex-col items-center">
            <FaSignOutAlt className="text-2xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
