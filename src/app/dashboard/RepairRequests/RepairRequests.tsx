import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../utils/api";
import { useContext } from "react";
import { ThemeContext } from "@/app/ThemeContext"; // لاستدعاء حالة الوضع الداكن
import AvailableRequests from "./AvailableRequests"; // استيراد الطلبات المتاحة
import PendingRequests from "./PendingRequests"; // استيراد الطلبات المتاحة
import Completed from "./completed";

const RepairRequests = () => {
  const [activeTab, setActiveTab] = useState("available"); // تبويب النشط
  const [repairRequests, setRepairRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext); // التحقق من حالة الوضع الداكن

  useEffect(() => {
    const fetchRepairRequests = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}/maintenance-requests/all/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          setRepairRequests(response.data);
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

    fetchRepairRequests();
  }, []);

  // دالة لإلغاء الطلب
  const handleCancelRequest = async (requestId: string) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${API_BASE_URL}/maintenance-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("تم إلغاء الطلب بنجاح.");
        setRepairRequests(repairRequests.filter((req) => req.id !== requestId)); // تحديث القائمة
      } else {
        toast.warn("لم يتم العثور على الطلب.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إلغاء الطلب:", error);
      toast.error("حدث خطأ أثناء إلغاء الطلب.");
    }
  };

  return (
    <div className="p-4 flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">طلبات الإصلاح</h1>

      {/* تبويبات */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "available" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("available")}
        >
          الطلبات المرسلة
        </button>
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          الطلبات المعلقة
        </button>
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "Quoted" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Quoted")}
        >
          قيد الاصلاح
        </button>
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          الطلبات المنجزة
        </button>
      </div>

      {loading ? (
        <p>جارٍ تحميل البيانات...</p>
      ) : (
        <div
          className={`w-full flex-grow ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } overflow-y-auto`}
        >
          {/* محتوى التبويب النشط */}
          {activeTab === "available" && (
            <AvailableRequests
              repairRequests={repairRequests}
              handleAssignRequest={handleCancelRequest}
            />
          )}
          {activeTab === "pending" && (
            <div>
              <PendingRequests />
            </div>
          )}
          {activeTab === "completed" && (
            <div>
              <Completed />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RepairRequests;
