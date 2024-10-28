"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navBar";
import { ThemeContext } from "../ThemeContext";
import Notifications from "./notification";
import Users from "./users";
import Technicians from "./technicians";
import { toast } from "react-toastify";
import DashboardHome from "./DashboardHome";
import RepairRequestsPage from "./RepairRequests";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "@/app/context/AuthContext";
import {
  FaHome,
  FaUsers,
  FaTools,
  FaBell,
  FaCogs,
  FaWrench,
  FaSignOutAlt,
  FaChevronUp,
  FaChevronDown,
  FaStar,
  FaMobileAlt,
  FaConciergeBell,
  FaPhoneAlt,
} from "react-icons/fa"; // استيراد الأيقونات
import TechniciansTable from "./technicians";
import ServicesComponent from "./services";
import DevicesModels from "./DevicesModels";
import ContactMessages from "./ContactUsAndFAQ";
import Review from "./Review";
import ContactUsAndFAQ from "./ContactUsAndFAQ";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true); // حالة الطي
  const { logout } = useContext(AuthContext); // استخدام isLoggedIn و logout من AuthContext

  // دالة للتحقق من صلاحيات المستخدم
  useEffect(() => {
    const checkAdminRole = () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "ADMIN" && userRole !== "SUBADMIN") {
        router.push("/unauthorized");
      } else {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [router]); // Include `router` if it's not stable across renders

  const navigationOptions = [
    { name: "الرئيسية", icon: <FaHome />, key: "home" },
    { name: "طلبات الإصلاح", icon: <FaWrench />, key: "repairRequests" },
    { name: "الإشعارات", icon: <FaBell />, key: "notifications" },
    { name: "اتصل بنا", icon: <FaPhoneAlt />, key: "contact-us" },
    { name: "الخدمات", icon: <FaConciergeBell />, key: "services" },
    { name: "موديلات الأجهزة", icon: <FaMobileAlt />, key: "device_models" },
    { name: "التقييمات", icon: <FaStar />, key: "review" },
    { name: "المستخدمين", icon: <FaUsers />, key: "users" },
    { name: "التقنيين", icon: <FaTools />, key: "technicians" },
    { name: "الإعدادات", icon: <FaCogs />, key: "settings" },
  ];
  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح!");
    window.location.href = "/";
  };
  // تقسيم المصفوفة إلى صفوف
  const firstRow = navigationOptions.slice(0, 4);
  const secondRow = navigationOptions.slice(4, 8);

  // دالة رندر المحتوى بناءً على التبويب النشط
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "users":
        return <Users />;
      case "technicians":
        return <Technicians />;
      case "repairRequests":
        return <RepairRequestsPage />;
      case "notifications":
        return <Notifications />;
      case "contact-us":
        return <ContactUsAndFAQ />;
      case "services":
        return <ServicesComponent />;
      case "device_models":
        return <DevicesModels />;
      case "review":
        return <Review />;
      case "settings":
        return <div>الإعدادات</div>;
      default:
        return <div>الرئيسية</div>;
    }
  };

  // عرض رسالة تحميل أثناء التحقق من الصلاحيات
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen min-w-screen">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Navbar />

      {/* الشريط الجانبي للشاشات الكبيرة */}
      <div
        className={`hidden md:flex p-6 mt-16 flex-col w-1/5  ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-xl font-bold my-6 text-center">لوحة التحكم</h2>
        <ul className="space-y-6">
          {navigationOptions.map((option) => (
            <li
              key={option.key}
              className={`flex items-center cursor-pointer p-3 rounded-lg ${
                activeTab === option.key ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab(option.key)}
              aria-label={option.name}
            >
              {option.icon}
              <span className="ml-4 text-lg mr-5">{option.name}</span>
            </li>
          ))}
          <li
            className={`flex items-center cursor-pointer p-3 rounded-lg text-red-500 hover:text-red-700`}
            onClick={handleLogout}
            aria-label="تسجيل الخروج"
          >
            <FaSignOutAlt className="ml-2" />
            <span className="ml-4 text-lg">تسجيل الخروج</span>
          </li>
        </ul>
      </div>

      {/* الحاوية الرئيسية للمحتوى */}
      <div className={`flex-grow p-6 mt-16 w-full md:w-4/5 pb-20 md:pb-0`}>
        {renderContent()}
      </div>

      {/* شريط التنقل السفلي للشاشات الصغيرة */}
      <div
        className={`fixed bottom-0 left-0 w-full md:hidden z-20 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-700 text-black"
        }`}
      >
        <div className="flex flex-col">
          {/* زر الطي/التوسيع */}
          <div className="flex justify-center p-1 border-t border-yellow-500 ">
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
          {/* الصف الأول من شريط التنقل السفلي */}
          <div className="flex justify-around p-1 border-t border-yellow-500">
            {firstRow.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveTab(option.key)}
                className={`flex flex-col items-center flex-1 py-1 ${
                  activeTab === option.key
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

          {/* الصف الثاني من شريط التنقل السفلي وزر تسجيل الخروج */}
          {!isCollapsed && (
            <>
              <div className="flex justify-around p-1 border-t border-yellow-500">
                {secondRow.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setActiveTab(option.key)}
                    className={`flex flex-col items-center flex-1 py-1 ${
                      activeTab === option.key
                        ? "text-yellow-800"
                        : isDarkMode
                        ? "text-gray-300"
                        : "text-white"
                    } transition-colors duration-200`}
                    aria-label={option.name}
                  >
                    {option.icon}
                    <span className="text-sm mt-1">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* زر تسجيل الخروج في الشريط السفلي */}
              <div className="flex justify-center p-1 border-t border-yellow-500">
                <button
                  onClick={handleLogout}
                  className={`flex flex-col items-center text-red-500 hover:text-red-700 transition-colors duration-200`}
                  aria-label="تسجيل الخروج"
                >
                  <FaSignOutAlt className="text-2xl" />
                  <span className="text-sm mt-1">خروج</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
