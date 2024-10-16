"use client";
import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar";
import Profile from "../dashboard/profile";
import { AuthContext } from "@/app/context/AuthContext";
import "../../components/dashboard/dashboard.css";
import { ThemeContext } from "../ThemeContext";
import { useRouter } from "next/navigation";
import RepairRequests from "./RepairRequests/RepairRequests";
import Notifications from "./notification";
const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");
  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // دالة لتحديد المحتوى الذي سيتم عرضه بناءً على الخيار المختار
  const renderContent = () => {
    switch (selectedOption) {
      case "viewRequests":
        return (
          <div>
            <RepairRequests />
          </div>
        );
      case "notifications":
        return (
          <div>
            <Notifications />
          </div>
        );
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      setTimeout(() => {
        setLoading(false); // انتهاء التحميل بعد التحقق
      }, 1000); // يمكنك تعديل المهلة
    };

    checkAuth();
  }, []);

  // التحقق من حالة تسجيل الدخول بعد انتهاء التحميل
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/unauthorized"); // إعادة التوجيه لصفحة ليس لديك صلاحية
    }
  }, [isLoggedIn, loading, router]);

  // عرض رسالة أثناء التحقق من حالة تسجيل الدخول
  if (loading) {
    return <div>جاري التحقق من حالة تسجيل الدخول...</div>;
  }

  // عدم عرض الداشبورد إذا لم يكن المستخدم مسجلاً للدخول
  if (!isLoggedIn) {
    return null;
  }

  // عرض لوحة التحكم إذا كان المستخدم مسجلاً للدخول
  return (
    <>
      <Navbar />
      <div
        className={`flex flex-row ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
        style={{
          minHeight: "100vh", // ضمان أن الحاوية لا تقل عن طول الشاشة
          paddingTop: "64px", // إضافة الـ padding لأسفل النافبار
        }}
      >
        {/* Sidebar */}
        <Sidebar onSelectOption={setSelectedOption} />

        {/* الحاوية الرئيسية */}
        <div
          className={`flex-1 flex justify-center items-center p-6 ${
            isDarkMode ? "bg-gray-600" : "bg-white"
          }`}
          style={{
            minHeight: "100%", // الحاوية تمتد لتتوافق مع طول الشاشة
            width: "100%",
            overflowY: "auto", // السماح بالتمرير عند وجود محتوى طويل
          }}
        >
          <div
            className="flex flex-col justify-center items-center"
            style={{ width: "100%", maxWidth: "800px", minHeight: "100%" }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
