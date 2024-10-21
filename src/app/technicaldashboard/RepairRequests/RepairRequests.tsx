import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../utils/api";
import { ThemeContext } from "@/app/ThemeContext"; // لاستدعاء حالة الوضع الداكن
import Tabs from "@/components/Tabs";
import { ClipLoader } from "react-spinners";
import RepairRequestCard from "@/components/RepairRequestCard"; // استيراد مكون البطاقة
import { RepairRequest } from "@/utils/types";

const RepairRequests: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext); // التحقق من حالة الوضع الداكن
  const [activeTab, setActiveTab] = useState<string>("available"); // التبويب النشط

  // تعريف statusMap
  const statusMap: { [key: string]: string } = {
    PENDING: "قيد الانتظار",
    IN_PROGRESS: "جارٍ التنفيذ",
    COMPLETED: "مكتمل",
    REJECTED: "مرفوض",
    ASSIGNED: "قيد التسعير",
    QUOTED: "انتظار القبول",
  };

  // دالة لجلب البيانات بناءً على التبويب النشط
  const fetchRepairRequests = async (tab: string) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      let endpoint = `${API_BASE_URL}/maintenance-requests/all`;

      // تغيير رابط الجلب حسب التبويب النشط
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
        } else if (response.data.message === "لا يوجد طلبات حاليا") {
          setRepairRequests([]); // تعيين مصفوفة فارغة
          toast.info("لا توجد طلبات في هذا التبويب."); // عرض رسالة تنبيه
        } else {
          console.warn("البيانات المستلمة ليست مصفوفة.");
          toast.warn("لا يوجد طلبات في هذا التبويب");
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
    fetchRepairRequests(activeTab); // جلب البيانات حسب التبويب النشط
  }, [activeTab]); // تحديث عند تغيير التبويب

  const onRequestUpdated = async () => {
    fetchRepairRequests(activeTab); // تحديث الطلبات عند التحديث
  };

  // تعريف التبويبات
  const tabs = [
    { label: "الطلبات المتاحة", key: "available" },
    { label: "الطلبات المستلمة", key: "assign" },
    { label: "بانتظار الموافقة", key: "quote" },
    { label: "قيد الاصلاح", key: "in_progress" },
    { label: "الطلبات المنجزة", key: "completed" },
    { label: "الطلبات المرفوضة", key: "rejected" },
  ];

  return (
    <div className="flex flex-col w-full" style={{ minHeight: "90vh" }}>
      <h1 className="text-2xl text-center font-bold mb-4">طلبات الإصلاح</h1>

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
          {/* قائمة التبويبات */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:justify-center mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`p-2 text-center rounded ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* عرض الطلبات أو رسالة إذا كانت المصفوفة فارغة */}
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
