import React, { useContext, useState } from "react";
import { ThemeContext } from "@/app/ThemeContext";
import { ClipLoader } from "react-spinners";
import { RepairRequest } from "../utils/types";
import Image from "next/image";
import PricingForm from "./forms/costform";
import Modal from "react-modal";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { toast } from "react-toastify"; // استيراد toast

interface RepairRequestCardProps {
  request: RepairRequest;
  statusMap: { [key: string]: string };
  userRole: "ADMIN" | "SUB_ADMIN" | "USER" | "TECHNICIAN";
  onRequestUpdated: () => void; // دالة لتحديث الطلبات
}

const RepairRequestCard: React.FC<RepairRequestCardProps> = ({
  request,
  statusMap,
  userRole,
  onRequestUpdated, // استخدم الدالة هنا
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getButtonLabel = () => {
    if (userRole === "TECHNICIAN") {
      if (request.status === "ASSIGNED") {
        return "تسعير الطلب";
      } else if (request.status === "IN_PROGRESS") {
        return "تسليم المهمة";
      }
      return "استلام المهمة";
    }
    return "حذف";
  };

  const handleButtonClick = () => {
    if (userRole === "TECHNICIAN" && request.status === "ASSIGNED") {
      setIsModalOpen(true);
    } else if (userRole === "TECHNICIAN" && request.status === "IN_PROGRESS") {
      handleSubmitTask();
    } else if (userRole === "TECHNICIAN") {
      handleReceiveTask();
    } else {
      handleDeleteRequest();
    }
  };

  const handleReceiveTask = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await axios.put(
        `${API_BASE_URL}/api/maintenance-requests/${request.id}/assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم استلام المهمة بنجاح"); // عرض رسالة النجاح
        onRequestUpdated(); // تحديث الطلبات
      } else {
        toast.error("فشل في استلام المهمة");
      }
    } catch (error) {
      toast.error("خطأ في استلام المهمة");
      console.error("خطأ في استلام المهمة", error);
    }
  };

  const handleSubmitTask = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await axios.put(
        `${API_BASE_URL}/api/maintenance-requests/${request.id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تسليم المهمة بنجاح");
        onRequestUpdated(); // تحديث الطلبات
      } else {
        toast.error("فشل في تسليم المهمة");
      }
    } catch (error) {
      toast.error("خطأ في تسليم المهمة");
      console.error("خطأ في تسليم المهمة", error);
    }
  };

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await axios.delete(
        `${API_BASE_URL}/maintenance-requests/${request.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم حذف الطلب بنجاح");
        onRequestUpdated(); // تحديث الطلبات
      } else {
        toast.error("فشل في حذف الطلب");
      }
    } catch (error) {
      toast.error("خطأ في حذف الطلب");
      console.error("خطأ في حذف الطلب", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`max-w-sm rounded-lg shadow-md overflow-hidden mb-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <Image
        src={
          typeof request.deviceImage === "string"
            ? request.deviceImage
            : "/assets/images/default-device.png"
        }
        alt={String(request.deviceType) || "Unknown device"}
        width={500}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 border-b">
          {String(request.user.fullName) || "اسم غير معروف"}
        </h2>
        <p className="mb-2 border-b pb-2">
          <strong>المحافظة:</strong>
          <strong className="mr-2">
            {String(request.governorate) || "غير محدد"}
          </strong>
        </p>
        <div className="flex justify-between mb-2 border-b pb-2">
          <p className="border-l pl-2">
            <strong>نوع الجهاز:</strong>{" "}
            {String(request.deviceType) || "غير محدد"}
          </p>
          <p>
            <strong>موديل الجهاز:</strong>{" "}
            {String(request.deviceModel) || "غير معروف"}
          </p>
        </div>

        <p className="mb-2 border-b pb-2">
          <strong> الحالة:</strong>
          <span
            className={`text-sm font-semibold ${
              request.status === "COMPLETED"
                ? "text-green-500"
                : request.status === "IN_PROGRESS"
                ? "text-yellow-500"
                : request.status === "REJECTED"
                ? "text-red-500"
                : request.status === "QUOTED"
                ? "text-purple-500"
                : request.status === "ASSIGNED"
                ? "text-orange-500"
                : request.status === "PENDING"
                ? "text-gray-500"
                : "text-blue-500"
            }`}
          >
            {statusMap[request.status] || "حالة غير معروفة"}
          </span>
        </p>

        {isExpanded && (
          <div>
            <p className="border-b pb-2">
              <strong>رقم الهاتف:</strong>{" "}
              {String(request.user.phoneNO) || "غير متوفر"}
            </p>
            <p className="border-b pb-2">
              <strong>العنوان:</strong>{" "}
              {String(request.user.address) || "غير معروف"}
            </p>
            <p className="border-b pb-2">
              <strong>وصف المشكلة:</strong>{" "}
              {String(request.problemDescription) || "غير متوفر"}
            </p>
            <p className="border-b pb-2">
              <strong>التقني المخصص:</strong>
              {request.technician?.user.fullName || "غير محدد"}
            </p>
            <p className="border-b pb-2">
              <strong>التكلفة:</strong>
              {request.cost === 0
                ? "غير مسعر بعد"
                : String(request.cost) || "غير متوفر"}
            </p>
            <p className="border-b pb-2">
              <strong>اجور الكشف:</strong>
              <span
                className={`font-bold ${
                  request.isPaid ? "text-green-500" : "text-red-500"
                }`}
              >
                {request.isPaidCheckFee ? "تم الدفع" : "لم يتم الدفع"}
              </span>
            </p>
            <p className="border-b pb-2">
              <strong>اجور الصيانة :</strong>
              <span
                className={`font-bold ${
                  request.isPaid ? "text-green-500" : "text-red-500"
                }`}
              >
                {request.isPaid ? "تم الدفع" : "لم يتم الدفع"}
              </span>
            </p>
            <p className="border-b pb-2">
              <strong>تاريخ الطلب:</strong>{" "}
              {String(request.createdAt) || "غير متوفر"}
            </p>
          </div>
        )}

        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={handleButtonClick}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            getButtonLabel()
          )}
        </button>

        <button
          className="mt-2 mr-4 px-2 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "عرض أقل" : "عرض المزيد"}
        </button>
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <PricingForm
          requestId={String(request.id)} //
          onClose={() => setIsModalOpen(false)}
          onRequestUpdated={onRequestUpdated}
        />
      </Modal>
    </div>
  );
};

export default RepairRequestCard;
