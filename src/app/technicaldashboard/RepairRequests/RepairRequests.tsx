import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";
import RepairRequestCard from "@/components/RepairRequestCard";
import { RepairRequest } from "@/utils/types";

const RepairRequests: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<string>("available");
  const [tabCounts, setTabCounts] = useState<{ [key: string]: number }>({
    available: 0,
    assign: 0,
    quote: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  });

  const statusMap: { [key: string]: string } = {
    PENDING: "قيد الانتظار",
    IN_PROGRESS: "جارٍ التنفيذ",
    COMPLETED: "مكتمل",
    REJECTED: "مرفوض",
    ASSIGNED: "قيد التسعير",
    QUOTED: "انتظار القبول",
  };

  const fetchRepairRequests = async (tab: string) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      let endpoint = `${API_BASE_URL}/maintenance-requests/all`;

      if (tab === "quote") {
        endpoint += "/quote";
      } else if (tab === "in_progress") {
        endpoint += "/in-progress";
      } else if (tab === "assign") {
        endpoint += "/assign";
      } else if (tab === "completed") {
        endpoint += "/complete";
      } else if (tab === "rejected") {
        endpoint += "/reject";
      } else {
        endpoint += "/Pending";
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setRepairRequests(response.data);
          setTabCounts((prev) => ({
            ...prev,
            [tab]: response.data.length,
          }));
        } else {
          toast.info("لا توجد طلبات في هذا التبويب.");
        }
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
      toast.error("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    fetchRepairRequests(activeTab);
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const onRequestUpdated = async () => {
    fetchRepairRequests(activeTab);
  };

  const tabs = [
    { label: "الطلبات المتاحة", key: "available" },
    { label: "الطلبات المستلمة", key: "assign" },
    { label: "بانتظار الموافقة", key: "quote" },
    { label: "قيد الاصلاح", key: "in_progress" },
    { label: "الطلبات المنجزة", key: "completed" },
    { label: "الطلبات المرفوضة", key: "rejected" },
  ];

  return (
    <div className="flex flex-col mt-2 w-full" style={{ minHeight: "90vh" }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      ) : (
        <div
          className={`w-full flex-grow p-2 rounded ${
            isDarkMode ? "bg-gray-700" : "bg-gray-400"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:justify-center mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`relative p-2 text-center rounded ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setActiveTab(tab.key)} // تعيين التبويب النشط
              >
                {tab.label}
                {tabCounts[tab.key] > 0 && (
                  <span className="absolute top-5 right-4 mt-[-10px] mr-[-10px] bg-yellow-500 text-black text-xs rounded-full px-2 py-1">
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {repairRequests.length === 0 ? (
            <div className="flex justify-center items-center h-screen">
              <p className="text-xl text-gray-700">
                لا توجد طلبات في هذا التبويب.
              </p>
            </div>
          ) : (
            <div className="p-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {repairRequests.map((request) => (
                <RepairRequestCard
                  userRole={"TECHNICIAN"}
                  key={request.id}
                  request={request as RepairRequest}
                  statusMap={statusMap}
                  onRequestUpdated={onRequestUpdated} // تمرير الدالة
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RepairRequests;
