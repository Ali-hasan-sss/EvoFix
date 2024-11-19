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

const RepairRequests = dynamic(
  () => import("./RepairRequests/RepairRequests"),
  {
    ssr: false, // تعطيل العرض المسبق من جانب الخادم
  }
);

const TechnicianDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");
  const [isVerified, setIsVerified] = useState(true);

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
      {/* رسالة التحذير */}
      {!isVerified && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div
            className="bg-red-500 text-white px-8 py-6 rounded-lg shadow-lg text-center"
            style={{ maxWidth: "90%" }}
          >
            حسابك غير مفعل. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.
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
