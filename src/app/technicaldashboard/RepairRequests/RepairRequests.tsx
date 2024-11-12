"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";
import RepairRequestCard from "@/components/RepairRequestCard";
import { RepairRequest } from "@/utils/types";
import { FaSync } from "react-icons/fa";
import PullToRefresh from "react-pull-to-refresh";

const RepairRequests: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<string>("available");

  const statusMap: { [key: string]: string } = {
    PENDING: "قيد الانتظار",
    IN_PROGRESS: "جارٍ التنفيذ",
    COMPLETED: "مكتمل",
    REJECTED: "مرفوض",
    ASSIGNED: "قيد التسعير",
    QUOTED: "انتظار القبول",
  };

  const fetchRepairRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const [technicianRequests, pendingRequests] = await axios.all([
        axios.get(`${API_BASE_URL}/maintenance-requests/all/technician`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_BASE_URL}/maintenance-requests/all/Pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const technicianData = Array.isArray(technicianRequests.data)
        ? technicianRequests.data
        : [];
      const pendingData = Array.isArray(pendingRequests.data)
        ? pendingRequests.data
        : [];

      const mergedData = [...technicianData, ...pendingData];
      setRepairRequests(mergedData);

      // التحقق من أننا في بيئة العميل قبل استخدام localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("repairRequests", JSON.stringify(mergedData));
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
      toast.error("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("repairRequests");
    if (storedData) {
      setRepairRequests(JSON.parse(storedData));
    } else {
      fetchRepairRequests();
    }
  }, []);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchRepairRequests();
  };

  const getTabCount = (tabKey: string) => {
    return repairRequests.filter((request) => {
      if (tabKey === "available") return request.status === "PENDING";
      if (tabKey === "assign") return request.status === "ASSIGNED";
      if (tabKey === "quote") return request.status === "QUOTED";
      if (tabKey === "in_progress") return request.status === "IN_PROGRESS";
      if (tabKey === "completed") return request.status === "COMPLETED";
      if (tabKey === "rejected") return request.status === "REJECTED";
      return false;
    }).length;
  };

  const tabs = [
    { label: "الطلبات المتاحة", key: "available" },
    { label: "الطلبات المستلمة", key: "assign" },
    { label: "بانتظار الموافقة", key: "quote" },
    { label: "قيد الاصلاح", key: "in_progress" },
    { label: "الطلبات المنجزة", key: "completed" },
    { label: "الطلبات المرفوضة", key: "rejected" },
  ];

  // فلترة الطلبات بناءً على التاب النشط
  const filteredRequests = repairRequests.filter((request) => {
    if (activeTab === "available") return request.status === "PENDING";
    if (activeTab === "assign") return request.status === "ASSIGNED";
    if (activeTab === "quote") return request.status === "QUOTED";
    if (activeTab === "in_progress") return request.status === "IN_PROGRESS";
    if (activeTab === "completed") return request.status === "COMPLETED";
    if (activeTab === "rejected") return request.status === "REJECTED";
    return false;
  });

  return (
    <div className="flex flex-col mt-4 w-full" style={{ minHeight: "90vh" }}>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex justify-start mb-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center w-10 h-10 px-2 py-1 rounded ${
              refreshing ? "bg-gray-500" : "bg-blue-500"
            } text-white hover:bg-blue-600 focus:outline-none`}
          >
            {refreshing ? (
              <ClipLoader color="#ffffff" size={18} />
            ) : (
              <FaSync className="mr-1" />
            )}
          </button>
        </div>
      </PullToRefresh>

      <div
        className={`w-full flex-grow p-2 rounded ${
          isDarkMode ? "bg-gray-700" : "bg-gray-400"
        }`}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:justify-center mb-4">
          {tabs.map((tab) => {
            const tabCount = getTabCount(tab.key);
            return (
              <button
                key={tab.key}
                className={`relative p-2 text-center rounded ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {tabCount > 0 && (
                  <span className="absolute top-2 right-3 inline-block bg-yellow-500 text-white text-xs rounded-full px-2 py-1">
                    {tabCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-gray-700">
              لا توجد طلبات في هذا التبويب.
            </p>
          </div>
        ) : (
          <div className="p-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRequests.map((request) => (
              <RepairRequestCard
                userRole={"TECHNICIAN"}
                key={request.id}
                request={request}
                statusMap={statusMap}
                onRequestUpdated={fetchRepairRequests}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairRequests;
