// components/RepairRequestCard.tsx

import React, { useContext } from "react";
import { ThemeContext } from "@/app/ThemeContext";
import { FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { RepairRequest } from "../utils/types";
import Image from "next/image"; // تأكد من استيراد Image

interface RepairRequestCardProps {
  request: RepairRequest;
  onDelete: (id: number) => void;
  statusMap: { [key: string]: string };
  isDeleting: boolean;
}

const RepairRequestCard: React.FC<RepairRequestCardProps> = ({
  request,
  onDelete,
  statusMap,
  isDeleting,
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  // دالة لتحديد صورة الجهاز بناءً على نوعه
  const getDeviceImage = (deviceType: string): string => {
    switch (deviceType.toLowerCase()) {
      case "غسالة":
        return "/assets/images/washing-machine.png";
      case "ثلاجة":
        return "/assets/images/fridge.png";
      case "جهاز تكييف":
        return "/assets/images/ac.png";
      default:
        return "/assets/images/default-device.png"; // صورة افتراضية
    }
  };

  return (
    <div
      className={`max-w-sm rounded-lg shadow-md overflow-hidden mb-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <Image
        src={getDeviceImage(request.deviceType)}
        alt={request.deviceType}
        width={500} // اضبط العرض حسب الحاجة
        height={300} // اضبط الارتفاع حسب الحاجة
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{request.user.fullName}</h2>
        <p className="mb-2">
          <strong>المحافظة:</strong> {request.governorate}
        </p>
        <p className="mb-2">
          <strong>رقم الهاتف:</strong> {request.user.phoneNO}
        </p>
        <p className="mb-2">
          <strong>العنوان:</strong> {request.user.address}
        </p>
        <p className="mb-2">
          <strong>نوع الجهاز:</strong> {request.deviceType}
        </p>
        <p className="mb-2">
          <strong>وصف المشكلة:</strong> {request.problemDescription}
        </p>
        <p className="mb-2">
          <strong>التقني المخصص:</strong>{" "}
          {request.technician?.user.fullName || "غير محدد"}
        </p>
        <p
          className={`text-sm font-semibold mb-2 ${
            request.status === "COMPLETED"
              ? "text-green-500"
              : request.status === "IN_PROGRESS"
              ? "text-yellow-500"
              : request.status === "REJECTED"
              ? "text-red-500"
              : "text-blue-500" // هنا يجب التأكد من وضع الألوان المناسبة
          }`}
        >
          الحالة: {statusMap[request.status] || "حالة غير معروفة"}
        </p>
        <button
          onClick={() => onDelete(request.id)}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
          disabled={isDeleting}
        >
          <FaTrash className="mr-2" />
          حذف
          {isDeleting && (
            <ClipLoader color="#ffffff" size={15} className="ml-2" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RepairRequestCard;
