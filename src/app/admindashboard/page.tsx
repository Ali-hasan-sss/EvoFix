"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation"; // تأكد من استيراد useRouter من next/navigation
import Navbar from "@/components/navBar";
import { ThemeContext } from "../ThemeContext"; // تأكد من استيراد ThemeContext
import Notifications from "./notification";
import Users from "./users";
import DashboardHome from "./DashboardHome";
import RepairRequestsPage from "./RepairRequests";
import { ClipLoader } from "react-spinners";
import {
  FaHome,
  FaUsers,
  FaTools,
  FaBell,
  FaCogs,
  FaWrench,
} from "react-icons/fa"; // استيراد الأيقونات

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext); // استخدم السياق هنا
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true); // إضافة حالة التحميل

  // دالة للتحقق من صلاحيات المستخدم
  const checkAdminRole = () => {
    const userRole = localStorage.getItem("userRole"); // يمكنك تعديل هذا بناءً على كيفية تخزين بيانات المستخدم
    if (userRole !== "ADMIN" && userRole !== "SUBADMIN") {
      router.push("/unauthorized"); // توجيه إلى صفحة عدم الصلاحية
    } else {
      setLoading(false); // إنهاء التحميل إذا كان المستخدم أدمن
    }
  };

  // تنفيذ التحقق عند تحميل الصفحة
  useEffect(() => {
    checkAdminRole();
  }, [checkAdminRole]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div>
            <DashboardHome />
          </div>
        );
      case "users":
        return (
          <div>
            <Users />
          </div>
        );

      case "users":
        return (
          <div>
            <Users />
          </div>
        );
      case "technicians":
        return <div>إدارة التقنيين</div>;
      case "repairRequests":
        return (
          <div>
            <RepairRequestsPage />
          </div>
        );
      case "notifications":
        return (
          <div>
            <Notifications />
          </div>
        );
      case "settings":
        return <div>الإعدادات</div>;
      default:
        return <div>الرئيسية</div>;
    }
  };

  // عرض رسالة تحميل أثناء التحقق من الصلاحيات
  if (loading) {
    return (
      <div className="flex contentn-center item-center">
        <div
          className={` ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      </div>
    );
  }

  // عرض لوحة التحكم إذا تم التحقق من أن المستخدم أدمن
  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* النافبار */}
      <Navbar />

      {/* Sidebar */}
      <div
        className={`w-1/5 bg-gray-800 text-white p-6 mt-16 ${
          isDarkMode ? "bg-gray-800 " : "bg-white"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">لوحة التحكم</h2>
        <ul className="space-y-4">
          <li
            className={`flex items-center cursor-pointer p-2 ${
              activeTab === "home" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("home")}
          >
            <FaHome className="ml-2" /> الرئيسية
          </li>
          <li
            className={`flex items-center cursor-pointer p-2 ${
              activeTab === "users" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="ml-2" /> المستخدمين
          </li>
          <li
            className={`flex items-center cursor-pointer p-2 ${
              activeTab === "technicians" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("technicians")}
          >
            <FaTools className="ml-2" /> التقنيين
          </li>
          <li
            className={`flex items-center cursor-pointer p-2 ${
              activeTab === "repairRequests" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("repairRequests")}
          >
            <FaWrench className="ml-2" /> طلبات الإصلاح
          </li>
          <li
            className={`flex items-center cursor-pointer p-2 ${
              activeTab === "notifications" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FaBell className="ml-2" /> الإشعارات
          </li>
          <li
            className={`flex items-center cursor-pointer p-2 ${
              activeTab === "settings" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCogs className="ml-2" /> الإعدادات
          </li>
        </ul>
      </div>

      {/* Container */}
      <div
        className={`w-4/5 p-6 mt-16 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
