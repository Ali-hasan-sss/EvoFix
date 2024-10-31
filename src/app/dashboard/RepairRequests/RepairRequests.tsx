import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { ThemeContext } from "@/app/context/ThemeContext";
import Tabs from "@/components/Tabs";
import { ClipLoader } from "react-spinners";
import RepairRequestCard from "@/components/RepairRequestCard";
import RepairRequestButton from "@/components/requestbutton";
import { RepairRequest } from "@/utils/types";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

const RepairRequests: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  // تعريف دالة fetchRepairRequests لجلب البيانات
  const fetchRepairRequests = async () => {
    setLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await axios.get<RepairRequest[]>(
        `${API_BASE_URL}/maintenance-requests/all/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        setRepairRequests(response.data);
        toast.success("تم تحديث الطلبات بنجاح.");
      } else {
        console.warn("البيانات المستلمة ليست مصفوفة.");
        toast.warn("البيانات المستلمة غير صحيحة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
      toast.error("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairRequests(); // استدعاء دالة جلب البيانات عند التحميل الأول
  }, []);

  // تحديث الطلبات عند حذف أو تعديل البيانات
  const onRequestUpdated = async () => {
    await fetchRepairRequests();
  };

  const tabs = [
    { label: "جميع الطلبات", key: "available" },
    { label: "قيد التسعير", key: "pending" },
    { label: "قيد الاصلاح", key: "in_progress" },
    { label: "الطلبات المنجزة", key: "completed" },
    { label: "الطلبات المرفوضة", key: "rejected" },
  ];

  const getFilteredRequests = (): RepairRequest[] => {
    switch (activeTab) {
      case "pending":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "PENDING"
        );
      case "in_progress":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "IN_PROGRESS"
        );
      case "completed":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "COMPLETED"
        );
      case "rejected":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "REJECTED"
        );
      case "available":
      default:
        return repairRequests;
    }
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="mt-3 flex flex-col w-full " style={{ minHeight: "90vh" }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      ) : (
        <div
          className={`w-full flex-grow p-2 rounded ${
            isDarkMode ? "bg-gray-700" : "bg-gray-500"
          }`}
        >
          <RepairRequestButton />
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRequests.length === 0 ? (
              <p>لا توجد طلبات في هذا التبويب.</p>
            ) : (
              filteredRequests.map((request) => (
                <RepairRequestCard
                  userRole={"USER"}
                  key={request.id}
                  request={request}
                  statusMap={statusMap}
                  onRequestUpdated={onRequestUpdated} // تمرير الدالة للتحديث
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairRequests;
