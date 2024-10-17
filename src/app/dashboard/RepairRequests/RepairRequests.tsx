// components/RepairRequests.tsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../utils/api";
import { ThemeContext } from "@/app/ThemeContext"; // لاستدعاء حالة الوضع الداكن
import Tabs from "@/components/Tabs";
import RepairRequestCard from "@/components/RepairRequestCard"; // استيراد مكون البطاقة
import { RepairRequest } from "@/utils/types";

const RepairRequests: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext); // التحقق من حالة الوضع الداكن
  const [activeTab, setActiveTab] = useState<string>("available"); // تبويب النشط

  // تعريف statusMap
  const statusMap: { [key: string]: string } = {
    PENDING: "قيد الانتظار",
    IN_PROGRESS: "جارٍ التنفيذ",
    COMPLETED: "مكتمل",
    REJECTED: "مرفوض",
  };

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

        //  console.log("البيانات المستلمة:", response.data);

        if (response.status === 200 && Array.isArray(response.data)) {
          setRepairRequests(response.data);
          console.log(response.data);
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
  const handleCancelRequest = async (requestId: number) => {
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
        setRepairRequests(repairRequests.filter((req) => req.id !== requestId));
      } else {
        toast.warn("لم يتم العثور على الطلب.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إلغاء الطلب:", error);
      toast.error("حدث خطأ أثناء إلغاء الطلب.");
    }
  };

  // تعريف التبويبات
  const tabs = [
    { label: "جميع الطلبات", key: "available" },
    { label: "قيد التسعير", key: "pending" },
    { label: "قيد الاصلاح", key: "in_progress" },
    { label: "الطلبات المنجزة", key: "completed" },
    { label: "الطلبات المرفوضة", key: "rejected" },
  ];

  // دالة لتصفية الطلبات حسب التبويب
  const getFilteredRequests = (): RepairRequest[] => {
    switch (activeTab) {
      case "pending":
        return repairRequests.filter(
          (req: RepairRequest) => req.status === "PENDING"
        );
      case "in_progress":
        return repairRequests.filter(
          (req: RepairRequest) => req.status === "IN_PROGRESS"
        );
      case "completed":
        return repairRequests.filter(
          (req: RepairRequest) => req.status === "COMPLETED"
        );
      case "rejected":
        return repairRequests.filter(
          (req: RepairRequest) => req.status === "REJECTED"
        );
      case "available":
      default:
        return repairRequests;
    }
  };

  const filteredRequests = getFilteredRequests();

  // إضافة طباعة للتحقق من التبويب النشط والطلبات المفلترة
  useEffect(() => {
    console.log("التبويب النشط:", activeTab);
    console.log("الطلبات المفلترة:", filteredRequests);
  }, [activeTab, filteredRequests]);

  return (
    <div className="p-4 flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">طلبات الإصلاح</h1>

      {loading ? (
        <p>جارٍ تحميل البيانات...</p>
      ) : (
        <div
          className={`w-full flex-grow ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } overflow-y-auto`}
        >
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* عرض الطلبات المفلترة على شكل بطاقات */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRequests.length === 0 ? (
              <p>لا توجد طلبات في هذا التبويب.</p>
            ) : (
              filteredRequests.map((request) => (
                <RepairRequestCard
                  key={request.id}
                  request={request as RepairRequest}
                  onDelete={handleCancelRequest} // تمرير الدالة هنا
                  statusMap={statusMap}
                  isDeleting={loading} // افترض أنك تريد تمرير حالة الحذف
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
