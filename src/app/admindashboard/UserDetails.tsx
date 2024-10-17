"use client";

import React, { useContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ThemeContext } from "../ThemeContext";
import { toast } from "react-toastify";
import UserForm from "@/components/forms/UserForm";
import { UserFormInput } from "@/utils/types"; // Import the UserFormInput type

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNO: string;
  address: string;
  governorate: string;
  role: string;
  isActive: boolean;
}

interface UserDetailsProps {
  user: User | null;
  onClose: () => void;
}

const getUserRoleLabel = (role: string): string => {
  switch (role) {
    case "admin":
      return "مدير";
    case "user":
      return "مستخدم";
    case "technician":
      return "فني";
    default:
      return "غير محدد"; // أو أي قيمة افتراضية تفضلها
  }
};

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);

  const initialFormData: UserFormInput = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNO: user?.phoneNO || "",
    address: user?.address || "",
    governorate: user?.governorate || "",
    role: user?.role || "",
    isActive: user?.isActive || false,
    password: "", // قيمة افتراضية
    confirmPassword: "", // قيمة افتراضية
  };

  const handleEditSubmit = async (data: UserFormInput) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      await axios.put(`${API_BASE_URL}/users/${user?.id}`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setIsEditing(false);
      onClose();
      toast.success("تم تعديل معلومات المستخدم بنجاح!");
    } catch (error) {
      console.error("فشل في تحديث المعلومات:", error);
      toast.error("حدث خطأ أثناء محاولة تعديل معلومات المستخدم.");
    }
  };

  if (isEditing) {
    return (
      <UserForm
        initialData={initialFormData}
        onSubmit={handleEditSubmit}
        submitButtonLabel="تحديث"
        isUser={true}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
      <div
        className={`p-6 rounded shadow-lg w-10/12 md:w-1/2 max-h-full overflow-auto ${
          isDarkMode
            ? "bg-gray-800 text-white border border-gray-700"
            : "bg-blue-300 text-black border border-black-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">تفاصيل المستخدم</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <strong>الاسم الكامل:</strong>
            <p>{user?.fullName}</p>
          </div>
          <div className="border p-4 rounded break-words">
            <strong>البريد الإلكتروني:</strong>
            <p className="break-all">{user?.email}</p>
          </div>
          <div className="border p-4 rounded">
            <strong>رقم الهاتف:</strong>
            <p>{user?.phoneNO}</p>
          </div>
          <div className="border p-4 rounded">
            <strong>المحافظة:</strong>
            <p>{user?.governorate}</p>
          </div>
          <div className="border p-4 rounded sm:col-span-2">
            <strong>العنوان:</strong>
            <p>{user?.address}</p>
          </div>
          <div className="border p-4 rounded">
            <strong>نوع المستخدم:</strong>
            <p>{getUserRoleLabel(user?.role || "")}</p>
          </div>
          <div className="border p-4 rounded flex items-center">
            <strong className="mr-2">الحالة:</strong>
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                user?.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </div>
        </div>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            تعديل
          </button>
          <button
            onClick={onClose}
            className="py-2 px-6 bg-red-500 text-white rounded hover:bg-red-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
