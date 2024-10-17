import React, { useContext } from "react";
import { ThemeContext } from "@/app/ThemeContext";
import { FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { RepairRequest } from "../utils/types";
import Image from "next/image";

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

  return (
    <div
      className={`max-w-sm rounded-lg shadow-md overflow-hidden mb-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      {/* عرض الصورة الواردة من الاستجابة */}
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
        <h2 className="text-xl font-bold mb-2">
          {String(request.user.fullName) || "اسم غير معروف"}
        </h2>
        <p className="mb-2">
          <strong>المحافظة:</strong> {String(request.governorate) || "غير محدد"}
        </p>
        <p className="mb-2">
          <strong>رقم الهاتف:</strong>{" "}
          {String(request.user.phoneNO) || "غير متوفر"}
        </p>
        <p className="mb-2">
          <strong>العنوان:</strong>{" "}
          {String(request.user.address) || "غير معروف"}
        </p>
        <p className="mb-2">
          <strong>نوع الجهاز:</strong>{" "}
          {String(request.deviceType) || "غير محدد"}
        </p>
        {/* عرض موديل الجهاز */}
        <p className="mb-2">
          <strong>موديل الجهاز:</strong>{" "}
          {String(request.deviceModel) || "غير معروف"}
        </p>
        <p className="mb-2">
          <strong>وصف المشكلة:</strong>{" "}
          {String(request.problemDescription) || "غير متوفر"}
        </p>
        <p className="mb-2">
          <strong>التقني المخصص:</strong>{" "}
          {request.technician?.user.fullName
            ? String(request.technician.user.fullName)
            : "غير محدد"}
        </p>
        <p
          className={`text-sm font-semibold mb-2 ${
            request.status === "COMPLETED"
              ? "text-green-500"
              : request.status === "IN_PROGRESS"
              ? "text-yellow-500"
              : request.status === "REJECTED"
              ? "text-red-500"
              : "text-blue-500"
          }`}
        >
          الحالة: {String(statusMap[request.status]) || "حالة غير معروفة"}
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
