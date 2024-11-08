"use client";
import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar";
import { AuthContext } from "@/app/context/AuthContext";
import "../../components/dashboard/dashboard.css";
import { ThemeContext } from "../context/ThemeContext";
import { useRouter } from "next/navigation";
import RepairRequests from "./RepairRequests/RepairRequests";
import Notifications from "../../components/dashboard/notification";
import Home from "../page";
import Invoices from "@/components/Invoices";

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
        setLoading(false);
      }, 1000);
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
        return <Home />;
      case "viewRequests":
        return <RepairRequests />;
      case "Invoices":
        return <Invoices />;
      case "notifications":
        return <Notifications />;
      case "profile":
        const userId = localStorage.getItem("userId");
        if (userId) {
          router.push(`/users/${userId}`);
          return null; // عدم عرض محتوى البروفايل لأنه يتم التوجيه
        } else {
          return <div>لم يتم العثور على معرف المستخدم</div>;
        }
      default:
        return null;
    }
  };

  // عرض لوحة التحكم إذا كان المستخدم مسجلاً للدخول
  return (
    <>
      <Navbar />
      <div
        className={`flex flex-row ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {/* Sidebar */}
        <div
          className="sidebar mt-20 custom-sidebar-scroll"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 4rem)",
            minHeight: "100vh",
          }}
        >
          <Sidebar onSelectOption={setSelectedOption} />
        </div>

        {/* Main content */}
        <div
          className={`flex-grow p-6 mt-16 w-full md:w-4/5 pb-20 md:pb-0 custom-main-scroll`}
          style={{ overflowY: "auto", maxHeight: "calc(100vh - 4rem)" }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
