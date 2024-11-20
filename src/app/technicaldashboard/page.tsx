"use client";

import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar"; // استبدال Sidebar الخاص بالتقني
import { AuthContext } from "@/app/context/AuthContext";
import "../../components/dashboard/dashboard.css";
import { ThemeContext } from "../context/ThemeContext";
import { useRouter } from "next/navigation";
import Notifications from "../../components/dashboard/notification";
import { ClipLoader } from "react-spinners";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

const RepairRequests = dynamic(
  () => import("./RepairRequests/RepairRequests"),
  {
    ssr: false, // تعطيل العرض المسبق من جانب الخادم
  }
);

const TechnicianDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");
  const [isVerified, setIsVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // التحقق من حالة تفعيل الحساب
  useEffect(() => {
    if (typeof window !== "undefined") {
      const verified = localStorage.getItem("isVerified");
      if (verified === "false") {
        setIsVerified(false);
      }
    }
  }, []);

  // استرجاع الخيار النشط من localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOption = localStorage.getItem("activeOption");
      if (storedOption) {
        setSelectedOption(storedOption);
      }
    }
  }, []);

  // حفظ الخيار النشط في localStorage عند تغييره
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeOption", selectedOption);
    }
  }, [selectedOption]);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const checkAuth = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    checkAuth();
  }, []);
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("لم يتم العثور على رمز المصادقة.");
      }

      await axios.post(
        `${API_BASE_URL}/users/resend-verify-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("تم إرسال بريد التحقق بنجاح.");
    } catch (error) {
      console.error("حدث خطأ أثناء إعادة إرسال بريد التحقق:", error);
      toast.error("حدث خطأ أثناء إعادة إرسال البريد. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/unauthorized");
    }
  }, [isLoggedIn, loading, router]);

  const renderContent = () => {
    switch (selectedOption) {
      case "viewRequests":
        return <RepairRequests />;
      case "notifications":
        return <Notifications />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen min-w-screen">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Toaster />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* رسالة التحذير */}
      {!isVerified && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div
            className="bg-red-400 text-white px-8 py-6 rounded-lg shadow-lg text-center"
            style={{ maxWidth: "90%" }}
          >
            <p>
              حسابك غير مفعل. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.
            </p>
            <button
              onClick={handleResendEmail}
              className={`mt-4 px-4 py-2 rounded-lg ${
                isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "جاري الإرسال..." : "إعادة إرسال بريد التحقق"}
            </button>
          </div>
        </div>
      )}

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

export default TechnicianDashboard;
