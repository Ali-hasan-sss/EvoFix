"use client";
import React, { useState, useContext } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar";
import Profile from "./profile";
import { AuthContext } from "@/app/context/AuthContext";
import "../../components/dashboard/dashboard.css";
import { ThemeContext } from "../ThemeContext";
import Link from "next/link"; // لاستيراد رابط التسجيل وتسجيل الدخول

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");
  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext);

  // دالة لرسم المحتوى بناءً على الاختيار
  const renderContent = () => {
    switch (selectedOption) {
      case "addRepair":
        return <div>هنا ستظهر صفحة طلب الإصلاح</div>;
      case "viewRequests":
        return <div>هنا ستظهر قائمة طلبات الإصلاح</div>;
      case "completedRepairs":
        return <div>هنا ستظهر قائمة الإصلاحات المنفذة</div>;
      case "pendingRequests":
        return <div>هنا ستظهر قائمة الطلبات قيد التنفيذ</div>;
      case "notifications":
        return <div>هنا ستظهر الإشعارات</div>;
      case "editProfile":
        return <div>هنا ستظهر صفحة تعديل الملف الشخصي</div>;
      case "deleteProfile":
        return <div>هنا ستظهر صفحة حذف الملف الشخصي</div>;
      case "profile": // إضافة خيار البروفايل
        return <Profile />; // عرض صفحة البروفايل
      default:
        return null;
    }
  };

  // التحقق من تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2>يجب عليك تسجيل الدخول أو إنشاء حساب للولوج إلى لوحة التحكم</h2>
          <Link href="/login" className="text-blue-500 underline mr-4">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="text-blue-500 underline">
            إنشاء حساب
          </Link>
        </div>
      </div>
    );
  }

  // عرض لوحة التحكم إذا كان المستخدم مسجلاً للدخول
  return (
    <>
      <Navbar />
      <div
        className={`flex main ${
          isDarkMode ? "bg-gray-900 text-white " : "bg-gray-100 text-black"
        }`}
        style={{ height: "calc(100vh - 64px)" }} // تعديل الارتفاع حسب ارتفاع النافبار
      >
        <Sidebar onSelectOption={setSelectedOption} />
        <div
          className={`flex-1 p-6 content ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
