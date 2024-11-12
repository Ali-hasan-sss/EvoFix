"use client";

import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar";
import { AuthContext } from "@/app/context/AuthContext";
import "../../components/dashboard/dashboard.css";
import { ThemeContext } from "../context/ThemeContext";
import { useRouter } from "next/navigation";
import Notifications from "../../components/dashboard/notification";
import Home from "../page";
import { ClipLoader } from "react-spinners";
import dynamic from "next/dynamic";
const Invoices = dynamic(() => import("@/components/Invoices"), {
  ssr: false, // تعطيل العرض المسبق من جانب الخادم
});
const RepairRequests = dynamic(
  () => import("./RepairRequests/RepairRequests"),
  {
    ssr: false, // تعطيل العرض المسبق من جانب الخادم
  }
);

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");

  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // استخدام useEffect للتأكد من أن localStorage يتم استخدامه فقط في بيئة العميل
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOption = localStorage.getItem("activeOption");
      if (storedOption && storedOption !== "profile") {
        setSelectedOption(storedOption);
      }
    }
  }, []);

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

  // حفظ الخيار النشط في localStorage عند تغييره
  useEffect(() => {
    if (typeof window !== "undefined" && selectedOption !== "profile") {
      localStorage.setItem("activeOption", selectedOption);
    }
  }, [selectedOption]);

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
        const userId =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("userId")
            : null;

        if (userId && userId.trim() !== "") {
          // إذا كان هناك userId صالح، يتم التوجيه إلى صفحة المستخدم
          router.push(`/users/${userId}`);
          return null;
        } else {
          // في حال لم يكن هناك userId صالح
          return <div>لم يتم العثور على معرف المستخدم</div>;
        }

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
      <div
        className={`flex flex-row ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
        }`}
      >
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

export default Dashboard;
