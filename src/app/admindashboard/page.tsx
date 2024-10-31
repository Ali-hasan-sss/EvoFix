"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navBar";
import { ThemeContext } from "../context/ThemeContext";
import Notifications from "../../components/dashboard/notification";
import Users from "./users/users";
import { toast } from "react-toastify";
import DashboardHome from "./DashboardHome";
import TermsOfUseAdmin from "./TermsOfUseAdmin";
import RepairRequestsPage from "./RepairRequests";
import { ClipLoader } from "react-spinners";
import Cookies from "js-cookie";
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
} from "react-icons/fa";
import ServicesComponent from "./services";
import DevicesModels from "./DevicesModels";
import ContactMessages from "./ContactUsAndFAQ";
import Review from "./Review";
import Invoices from "@/components/Invoices";
import ContactUsAndFAQ from "./ContactUsAndFAQ";
import { API_BASE_URL } from "@/utils/api";
import axios from "axios";
import { useDataCounts } from "../context/DataCountsContext";

// Main Admin Dashboard component
const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const stats = useDataCounts();
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { logout } = useContext(AuthContext);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check if the user has admin privileges
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
  }, [router]);

  // Retrieve active tab from local storage on load
  useEffect(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  // Fetch the notifications count from API
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
        setNotificationsCount(response.data.count);
      } catch (error: unknown) {
        console.error("خطأ في جلب عدد الإشعارات", error);
      }
    }
  };

  // Set up periodic refresh of notifications count every minute
  useEffect(() => {
    fetchNotificationsCount();

    const intervalId = setInterval(fetchNotificationsCount, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Retrieve user role from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      setUserRole(role);
    }
  }, []);

  // Define dashboard navigation options
  const navigationOptions = [
    { name: "الرئيسية", icon: <FaHome />, key: "home" },
    { name: "طلبات الإصلاح", icon: <FaWrench />, key: "repairRequests" },
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
    ...(userRole === "ADMIN"
      ? [
          { name: "اتصل بنا", icon: <FaPhoneAlt />, key: "contact-us" },
          { name: "الخدمات", icon: <FaConciergeBell />, key: "services" },
          {
            name: "موديلات الأجهزة",
            icon: <FaMobileAlt />,
            key: "device_models",
          },
          { name: "التقييمات", icon: <FaStar />, key: "review" },
          { name: "الشروط والسياسات", icon: <FaCogs />, key: "settings" },
        ]
      : []),
    { name: "المستخدمين", icon: <FaUsers />, key: "users" },
    { name: "الفواتير", icon: <FaUsers />, key: "Invoices" },
  ];

  // Handle logout action
  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح!");
    window.location.href = "/";
  };

  // Split navigation options into two rows for mobile display
  const firstRow = navigationOptions.slice(0, 4);
  const secondRow = navigationOptions.slice(4, 8);

  // Handle tab change and store active tab in local storage
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    localStorage.setItem("activeTab", key);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "users":
        return <Users />;
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
        return <TermsOfUseAdmin />;
      case "Invoices":
        return <Invoices />;
      default:
        return <div>الرئيسية</div>;
    }
  };

  // Show loading message while checking auth
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
      {/* Sidebar for large screens */}
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
                activeTab === option.key ? "bg-gray-700 text-white" : ""
              }`}
              onClick={() => handleTabChange(option.key)}
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
      {/* Main content container */}
      <div className={`flex-grow p-6 mt-16 w-full md:w-4/5 pb-20 md:pb-0`}>
        {renderContent()}
      </div>

      {/* Bottom bar for small screens */}
      <div
        className={`fixed bottom-0 left-0 w-full md:hidden z-20 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-700 text-black"
        }`}
      >
        <div className="flex flex-col">
          {/* Collapse/expand button */}
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

          {/* First row of navigation options */}
          <div className="flex justify-around p-1 border-t border-yellow-500">
            {firstRow.map((option) => (
              <button
                key={option.key}
                onClick={() => handleTabChange(option.key)}
                className={`flex flex-col items-center flex-1 py-1 ${
                  activeTab === option.key ? "text-yellow-500" : "text-white"
                } transition-colors duration-200`}
                aria-label={option.name}
              >
                {option.icon}
                <span className="text-sm mt-1">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Conditional rendering for second row */}
          {!isCollapsed && (
            <>
              <div className="flex justify-around p-1 border-t border-yellow-500">
                {secondRow.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleTabChange(option.key)}
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

              <div className="flex justify-around p-1 border-t border-yellow-500">
                {userRole === "ADMIN" && (
                  <button
                    onClick={() => handleTabChange("users")}
                    className={`flex flex-col items-center flex-1 py-1 ${
                      activeTab === "users"
                        ? "text-yellow-800"
                        : isDarkMode
                        ? "text-gray-300"
                        : "text-white"
                    } transition-colors duration-200`}
                    aria-label="المستخدمين"
                  >
                    <FaUsers />
                    <span className="text-sm mt-1">المستخدمين</span>
                  </button>
                )}
                <button
                  onClick={() => handleTabChange("Invoices")}
                  className={`flex flex-col items-center flex-1 py-1 ${
                    activeTab === "Invoices"
                      ? "text-yellow-800"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-white"
                  } transition-colors duration-200`}
                  aria-label="الفواتير"
                >
                  <FaUsers />
                  <span className="text-sm mt-1">الفواتير</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center flex-1 py-1 text-red-600"
                  aria-label="تسجيل الخروج"
                >
                  <FaSignOutAlt />
                  <span className="text-sm mt-1">تسجيل الخروج</span>
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
