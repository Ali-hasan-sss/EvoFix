"use client";
import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar";
import Profile from "./profile";
import { AuthContext } from "@/app/context/AuthContext";
import "../../components/dashboard/dashboard.css";
import { ThemeContext } from "../ThemeContext";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");
  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext); // الحصول على حالة تسجيل الدخول من السياق
  const [loading, setLoading] = useState(true); // حالة التحميل
  const router = useRouter();

  // دالة لتحديد المحتوى الذي سيتم عرضه بناءً على الخيار المختار
  const renderContent = () => {
    switch (selectedOption) {
      case "viewRequests":
        return <div>هنا ستظهر قائمة طلبات الإصلاح</div>;
      case "notifications":
        return <div>الإشعارات</div>;
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      // محاكاة التحقق من حالة تسجيل الدخول
      setTimeout(() => {
        setLoading(false); // انتهاء التحميل بعد التحقق
      }, 1000); // يمكنك تعديل المهلة
    };

    checkAuth();
  }, []);

  // التحقق من حالة تسجيل الدخول بعد انتهاء التحميل
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/"); // إعادة التوجيه لصفحة ليس لديك صلاحية
    }
  }, [isLoggedIn, loading, router]);

  // عرض رسالة أثناء التحقق من حالة تسجيل الدخول
  if (loading) {
    return <div>جاري التحقق من حالة تسجيل الدخول...</div>;
  }

  // عدم عرض الداشبورد إذا لم يكن المستخدم مسجلاً للدخول
  if (!isLoggedIn) {
    return null; // أو يمكنك إعادة توجيهه يدويًا أو عرض رسالة
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
            isDarkMode ? "bg-gray-600" : "bg-white"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
