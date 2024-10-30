"use client";
import React, { useState, useContext, useEffect } from "react";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/dashboard/Sidebar";
import Profile from "../../components/dashboard/profile";
import Home from "../page";
import { AuthContext } from "@/app/context/AuthContext";
import "../../components/dashboard/dashboard.css";
import { ThemeContext } from "../ThemeContext";
import { useRouter } from "next/navigation";
import RepairRequests from "./RepairRequests/RepairRequests";
import Notifications from "../../components/dashboard/notification";
import Invoices from "@/components/Invoices";
const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("viewRequests");
  const { isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      case "Invoices":
        return (
          <div>
            <Invoices />
          </div>
        );
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

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

  if (loading) {
    return <div>جاري التحقق من حالة تسجيل الدخول...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

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

        <div
          className={`flex-1 flex justify-center items-center p-6 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-400"
          }`}
          style={{
            minHeight: "100%",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <div
            className="flex flex-col py-4 mb-8"
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
