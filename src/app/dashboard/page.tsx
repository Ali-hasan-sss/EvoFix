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
import { ToastContainer } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import Cookies from "js-cookie";
import LoadingSpinner from "@/components/LoadingSpinner";

const Invoices = dynamic(() => import("@/components/Invoices"), {
  ssr: false,
});
const RepairRequests = dynamic(
  () => import("./RepairRequests/RepairRequests"),
  {
    ssr: false,
  }
);

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // تحديث حالة isVerified عند تحميل المكون
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = Cookies.get("token");

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsVerified(response.data.isVerified);
        console.log(isVerified);
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
      }
    };
    fetchVerificationStatus();
  }, [isVerified]);

  // التحقق المستمر عند تغيير حالة isVerified
  useEffect(() => {
    if (!isVerified) {
      console.warn("الحساب غير مفعل");
    }
  }, [isVerified]);

  useEffect(() => {
    const checkAuth = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    checkAuth();
  }, []);

  // استرجاع الخيار النشط من localStorage

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOption = localStorage.getItem("activeOption");
      if (storedOption) {
        setSelectedOption(storedOption);
      } else {
        setSelectedOption("viewRequests");
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/unauthorized");
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedOption !== "profile") {
      localStorage.setItem("activeOption", selectedOption);
    }
  }, [selectedOption]);
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const email = localStorage.getItem("email");

      await axios.post(`${API_BASE_URL}/users/resend-verify-email`, {
        email: email,
      });

      toast.success("تم إرسال بريد التحقق بنجاح.");
    } catch (error) {
      console.error("حدث خطأ أثناء إعادة إرسال بريد التحقق:", error);
      toast.error("حدث خطأ أثناء إعادة إرسال البريد. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedOption === "profile") {
      const userId =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("userId")
          : null;

      if (userId && userId.trim() !== "") {
        router.push(`/users/${userId}`);
      }
    }
  }, [selectedOption, router]);
  const renderContent = () => {
    if (!selectedOption) {
      return <LoadingSpinner />;
    }
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
        return <LoadingSpinner />;

      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
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
      <Toaster />
      <Navbar />
      {/* نافذة تغطي الشاشة بالكامل */}
      {!isVerified && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-40">
          <div
            className="bg-red-500 text-white px-8 py-6 rounded-lg shadow-lg text-center"
            style={{ maxWidth: "90%" }}
          >
            <p>
              حسابك غير مفعل. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.
            </p>
            <button
              onClick={handleResendEmail}
              className={`mt-4 px-4 py-2 rounded-lg ${
                isLoading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
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
        <div
          className="sidebar mt-20 md:w-1/5 custom-sidebar-scroll"
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
