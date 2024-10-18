import React, { useContext, useState } from "react";
import { ThemeContext } from "@/app/ThemeContext";
import { ClipLoader } from "react-spinners";
import { RepairRequest } from "../utils/types";
import Image from "next/image";
import PricingForm from "./forms/costform";
import Modal from "react-modal";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

interface RepairRequestCardProps {
  request: RepairRequest;
  statusMap: { [key: string]: string };
  userRole: "ADMIN" | "SUB_ADMIN" | "USER" | "TECHNICIAN";
}

const RepairRequestCard: React.FC<RepairRequestCardProps> = ({
  request,
  statusMap,
  userRole,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // حالة المودال
  const [isExpanded, setIsExpanded] = useState(false); // حالة التحكم في توسع الكارد

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
      ); // جلب التوكن من الكوكيز

      const response = await axios.put(
        `${API_BASE_URL}/api/maintenance-requests/${request.id}/assign`, // استخدام الـ baseURL هنا
        {}, // جسم الطلب فارغ
        {
          headers: {
            Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("تم تسليم المهمة بنجاح");
        // إضافة منطق إضافي بعد نجاح الطلب
      } else {
        console.error("فشل في تسليم المهمة", response.statusText);
      }
    } catch (error) {
      console.error("خطأ في تسليم المهمة", error);
    }
  };

  const handleSubmitTask = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      ); // جلب التوكن من الكوكيز

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
        console.log("تم تسليم المهمة بنجاح");
      } else {
        console.error("فشل في تسليم المهمة", response.statusText);
      }
    } catch (error) {
      console.error("خطأ في تسليم المهمة", error);
    }
  };

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      ); // جلب التوكن من الكوكيز

      const response = await axios.delete(
        `${API_BASE_URL}/maintenance-requests/${request.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
          },
        }
      );

      if (response.status === 200) {
        console.log("تم حذف الطلب بنجاح");
        // إضافة منطق إضافي بعد نجاح الحذف
      } else {
        console.error("فشل في حذف الطلب", response.statusText);
      }
    } catch (error) {
      console.error("خطأ في حذف الطلب", error);
    } finally {
      setIsDeleting(false); // إعادة حالة التحميل إلى false بعد الانتهاء
    }
  };

  return (
    <div
      className={`max-w-sm rounded-lg shadow-md overflow-hidden mb-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      {/* عرض الصورة */}
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

        {/* عرض التفاصيل عند التوسع */}
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
              <strong>حالة الدفع:</strong>{" "}
              {request.isPaid ? "تم الدفع" : "لم يتم الدفع"}
            </p>
          </div>
        )}

        {/* الأزرار: عرض المزيد وزر الأكشن */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {isExpanded ? "عرض أقل" : "عرض المزيد"}
          </button>
          <button
            onClick={handleButtonClick}
            className={`px-4 py-2 ${
              userRole === "TECHNICIAN" ? "bg-blue-500" : "bg-red-500"
            } text-white rounded hover:${
              userRole === "TECHNICIAN" ? "bg-blue-600" : "bg-red-600"
            } flex items-center justify-center`}
            disabled={isDeleting}
          >
            {getButtonLabel()}
            {isDeleting && (
              <ClipLoader color="#ffffff" size={15} className="ml-2" />
            )}
          </button>
        </div>
      </div>

      {/* المودال الخاص بتسعير الطلب */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="تسعير الطلب"
        className="Modal"
        overlayClassName="Overlay"
      >
        <PricingForm
          requestId={String(request.id)}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default RepairRequestCard;
