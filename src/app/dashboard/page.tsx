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
import Home from "../page";
const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");
  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // تعيين العنصر النشط من localStorage عند التحميل
  useEffect(() => {
    const storedOption = localStorage.getItem("activeOption");
    if (storedOption) {
      setSelectedOption(storedOption);
    }
  }, []);

  // عرض رسالة أثناء التحقق من حالة تسجيل الدخول
  if (loading) {
    return <div>جاري التحقق من حالة تسجيل الدخول...</div>;
  }

  // عدم عرض الداشبورد إذا لم يكن المستخدم مسجلاً للدخول
  if (!isLoggedIn) {
    return null;
  }

  // دالة لتحديد المحتوى الذي سيتم عرضه بناءً على الخيار المختار
  const renderContent = () => {
    switch (selectedOption) {
      case "viewHome":
        return (
          <div>
            <Home />
          </div>
        );
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

  // عرض لوحة التحكم إذا كان المستخدم مسجلاً للدخول
  return (
    <>
      <Navbar />
      <div
        className={`flex flex-row  ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
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
          className={`flex-1 flex justify-center items-center rounded ${
            isDarkMode ? "bg-black-600" : "bg-gray-400"
          }`}
          style={{
            minHeight: "100%",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <div
            className="flex flex-col py-4 mb-9"
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
