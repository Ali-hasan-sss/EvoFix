import React, { useState, useContext, useEffect } from "react";
import "./dashboard.css"; // تأكد من تضمين ملف CSS هنا
import profil from "./ali.png";
import { ThemeContext } from "@/app/ThemeContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaTools,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaBell,
  FaSignOutAlt,
  FaTrashAlt,
} from "react-icons/fa";

interface SidebarProps {
  onSelectOption: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(false); // حالة جديدة للتحكم في ظهور الأسماء
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setShowLabels(true); // بعد تأخير يظهر الأسماء
    }, 300); // يمكنك تغيير القيمة هنا حسب الحاجة
  };

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const token = localStorage.getItem("email");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // إرسال طلب تسجيل الخروج إلى الخادم
      const response = await axios.get(
        "https://evo-fix-api.vercel.app/api/users/logout",
        {}
      );

      if (response.status === 200) {
        // إزالة البيانات المخزنة
        localStorage.removeItem("email");
        localStorage.removeItem("userId");
        toast.success("تم تسجيل الخروج بنجاح!");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error("فشل في تسجيل الخروج. حاول مرة أخرى.");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج. حاول مرة أخرى.");
      console.error("Logout error:", error);
    }
  };

  const handleMouseLeave = () => {
    setShowLabels(false);
    setIsExpanded(false);
  };

  return (
    <div
      className={`transition-all duration-300 fixed right-0 top-20 ${
        isExpanded ? "w-64" : "w-20"
      } ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
      } h-full p-4 flex flex-col justify-between`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ borderRadius: "20px" }}
    >
      <div className="space-y-6 ">
        <div className="flex items-center justify-center">
          <img
            src={profil.src}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          {isExpanded && (
            <span className="ml-4 font-bold min-w-[150px] text-center">
              Ali Hasan
            </span>
          )}
        </div>
        <button
          onClick={() => onSelectOption("addRepair")}
          className="sidebar-button flex items-center justify-start"
        >
          <FaTools className="text-2xl mr-2" />
          {isExpanded && showLabels && (
            <span className="ml-4 min-w-[150px]">طلب إصلاح</span>
          )}
        </button>
        <button
          onClick={() => onSelectOption("viewRequests")}
          className="sidebar-button flex items-center justify-start"
        >
          <FaClipboardList className="text-2xl mr-2" />
          {isExpanded && showLabels && (
            <span className="ml-4 min-w-[150px]">طلبات الإصلاح</span>
          )}
        </button>
        <button
          onClick={() => onSelectOption("completedRepairs")}
          className="sidebar-button flex items-center justify-start"
        >
          <FaCheckCircle className="text-2xl mr-2" />
          {isExpanded && showLabels && (
            <span className="ml-4 min-w-[150px]">الإصلاحات المنفذة</span>
          )}
        </button>
        <button
          onClick={() => onSelectOption("pendingRequests")}
          className="sidebar-button flex items-center justify-start"
        >
          <FaClock className="text-2xl mr-2" />
          {isExpanded && showLabels && (
            <span className="ml-4 min-w-[150px]"> قيد التنفيذ</span>
          )}
        </button>
        <button
          onClick={() => onSelectOption("notifications")}
          className="sidebar-button flex items-center justify-start"
        >
          <FaBell className="text-2xl mr-2" />
          {isExpanded && showLabels && (
            <span className="ml-4 min-w-[150px]">الإشعارات</span>
          )}
        </button>
        <button
          onClick={() => onSelectOption("profile")}
          className="sidebar-button flex items-center justify-start"
        >
          <FaTools className="text-2xl mr-2" />
          {isExpanded && showLabels && (
            <span className="ml-4 min-w-[150px]"> تعديل الملف الشخصي</span>
          )}
        </button>
        <button
          onClick={() => onSelectOption("deleteProfile")}
          className="sidebar-button flex items-center justify-start"
        >
          <FaTrashAlt className="text-2xl mr-2" />
          {isExpanded && showLabels && (
            <span className="ml-4 min-w-[150px]"> حذف الملف الشخصي</span>
          )}
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="sidebar-button flex items-center justify-start"
          >
            <FaSignOutAlt className="text-2xl mr-2" />
            {isExpanded && showLabels && (
              <span className="ml-4 min-w-[150px]">تسجيل الخروج</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
