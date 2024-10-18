"use client";
import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar";
import Profile from "./profile";
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
      router.push("/unauthorized");
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
          minHeight: "100vh",
          paddingTop: "64px",
          overflowY: "auto",
        }}
      >
        {/* Sidebar */}
        <Sidebar onSelectOption={setSelectedOption} />

        {/* الحاوية الرئيسية */}
        <div
          className={`flex-1  flex justify-center items-center p-2 ${
            isDarkMode ? "bg-gray-600" : "bg-gray-400"
          }`}
          style={{
            minHeight: "100%",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <div
            className="flex flex-col "
            style={{ width: "100%", minHeight: "100%", overflowY: "auto" }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
