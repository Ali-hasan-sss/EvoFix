"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ThemeContext } from "../ThemeContext";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import GenericTable from "@/components/dashboard/GenericTable";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClipLoader } from "react-spinners";
import Switch from "react-switch";
import "react-toastify/dist/ReactToastify.css";

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

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const getUserRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "مسؤول";
      case "SUB_ADMIN":
        return "مسؤول فرعي";
      case "TECHNICAL":
        return "تقني";
      default:
        return "مستخدم";
    }
  };
  if (!user) return null; // إذا لم يتم تحديد مستخدم، لا تعرض شيئًا.

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
          {/* الاسم الكامل */}
          <div className="border p-4 rounded">
            <strong>الاسم الكامل:</strong>
            <p>{user.fullName}</p>
          </div>
          {/* البريد الإلكتروني */}
          <div className="border p-4 rounded break-words">
            <strong>البريد الإلكتروني:</strong>
            <p className="break-all">{user.email}</p>
          </div>
          {/* رقم الهاتف */}
          <div className="border p-4 rounded">
            <strong>رقم الهاتف:</strong>
            <p>{user.phoneNO}</p>
          </div>
          {/* المحافظة */}
          <div className="border p-4 rounded">
            <strong>المحافظة:</strong>
            <p>{user.governorate}</p>
          </div>
          {/* العنوان */}
          <div className="border p-4 rounded sm:col-span-2">
            <strong>العنوان:</strong>
            <p>{user.address}</p>
          </div>
          {/* نوع المستخدم */}
          <div className="border p-4 rounded">
            <strong>نوع المستخدم:</strong>
            <p>{getUserRoleLabel(user.role)}</p>
          </div>
          {/* الحالة */}
          <div className="border p-4 rounded flex items-center">
            <strong className="mr-2">الحالة:</strong>
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                user.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </div>
        </div>
        <div className="flex justify-center mt-6">
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

const Users: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // حالة الحذف
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null); // حالة التفعيل/التعطيل
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // المستخدم المحدد لعرض التفاصيل

  const fetchUsers = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUsers(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "فشل في جلب المستخدمين");
      } else {
        setError("حدث خطأ غير معروف");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = (userId: number, currentStatus: boolean) => {
    confirmAlert({
      title: "تأكيد التغيير",
      message: `هل أنت متأكد من أنك تريد ${
        currentStatus ? "تعطيل" : "تفعيل"
      } حساب هذا المستخدم؟`,
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setTogglingUserId(userId); // تعيين المستخدم الجاري تفعيله/تعطيله
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
              const authToken = token ? token.split("=")[1] : "";

              // إرسال طلب التعديل باستخدام axios
              await axios.put(
                `${API_BASE_URL}/users/${userId}`,
                { isActive: !currentStatus }, // تغيير حالة isActive
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );

              // تحديث حالة المستخدمين بعد التعديل
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === userId
                    ? { ...user, isActive: !currentStatus }
                    : user
                )
              );

              toast.success(
                `تم ${!currentStatus ? "تفعيل" : "تعطيل"} الحساب بنجاح!`
              );
            } catch (error) {
              console.error("فشل في تحديث الحالة:", error);
              toast.error("حدث خطأ أثناء محاولة تحديث حالة الحساب.");
            } finally {
              setTogglingUserId(null); // إلغاء حالة التعديل
            }
          },
        },
        {
          label: "لا",
          onClick: () => {
            toast.info("تم إلغاء عملية التغيير.");
          },
        },
      ],
    });
  };

  const handleDeleteUser = async (userId: number) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد من أنك تريد حذف هذا المستخدم؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setIsDeleting(true); // إظهار حالة الحذف
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
              const authToken = token ? token.split("=")[1] : "";

              // إرسال طلب الحذف باستخدام axios
              await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });

              // تحديث حالة المستخدمين بعد الحذف
              setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userId)
              );

              toast.success("تم حذف المستخدم بنجاح!");
            } catch (error) {
              console.error("فشل في حذف المستخدم:", error);
              toast.error("حدث خطأ أثناء محاولة حذف المستخدم.");
            } finally {
              setIsDeleting(false); // إخفاء حالة الحذف
            }
          },
        },
        {
          label: "لا",
          onClick: () => {
            toast.info("تم إلغاء عملية الحذف.");
          },
        },
      ],
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user); // تعيين المستخدم المحدد لعرض التفاصيل
  };

  const handleCloseDetails = () => {
    setSelectedUser(null); // إلغاء تحديد المستخدم وإغلاق نافذة التفاصيل
  };

  const getUserRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "مسؤول";
      case "SUB_ADMIN":
        return "مسؤول فرعي";
      case "TECHNICAL":
        return "تقني";
      default:
        return "مستخدم";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const tableData = users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    governorate: user.governorate,
    role: getUserRoleLabel(user.role),
    email: user.email,
    phoneNO: user.phoneNO,
    isActive: (
      <div className="flex items-center justify-center">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            user.isActive ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <Switch
          onChange={() => handleToggleActive(user.id, user.isActive)}
          checked={user.isActive}
          onColor="#4A90E2"
          offColor="#FF6347"
          disabled={togglingUserId === user.id || isDeleting}
        />
        {togglingUserId === user.id && (
          <ClipLoader color="#4A90E2" size={15} className="ml-2" />
        )}
      </div>
    ),
    actions: (
      <div className="flex space-x-2 justify-center">
        <button
          onClick={() => console.log(`تعديل المستخدم برقم المعرف: ${user.id}`)}
        >
          <FaEdit className="text-blue-500 hover:text-blue-700" />
        </button>
        <button onClick={() => handleDeleteUser(user.id)} disabled={isDeleting}>
          {isDeleting ? (
            <ClipLoader color="#FF6347" size={15} />
          ) : (
            <FaTrash
              className={`ms-2 ${
                isDeleting ? "text-gray-400" : "text-red-500 hover:text-red-700"
              }`}
            />
          )}
        </button>
        <button onClick={() => handleViewUser(user)}>
          <FaEye className="text-green-500 hover:text-green-700" />
        </button>
      </div>
    ),
  }));

  const tableColumns = [
    { title: "المعرف", accessor: "id" },
    { title: "اسم المستخدم", accessor: "fullName" },
    { title: "المحافظة", accessor: "governorate" },
    { title: "نوع المستخدم", accessor: "role" },
    { title: "البريد الالكتروني", accessor: "email" },
    { title: "رقم الهاتف", accessor: "phoneNO" },
    { title: "الحالة", accessor: "isActive" },
    { title: "العمليات", accessor: "actions" },
  ];

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">قائمة المستخدمين</h2>
      <GenericTable data={tableData} columns={tableColumns} />
      <ToastContainer position="top-right" autoClose={2000} />

      {/* عرض نافذة التفاصيل إذا كان هناك مستخدم محدد */}
      {selectedUser && (
        <UserDetails user={selectedUser} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default Users;
