"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ThemeContext } from "../ThemeContext";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import GenericTable, { Column } from "@/components/dashboard/GenericTable";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClipLoader } from "react-spinners";
import Switch from "react-switch";
import "react-toastify/dist/ReactToastify.css";
import UserDetails from "./UserDetails";
import UserCard from "./UserCard";
import { useMediaQuery } from "react-responsive";

interface User {
  displayId: number;
  id: number;
  fullName: string;
  email: string;
  phoneNO: string;
  address: string;
  governorate: string;
  role: string;
  isActive: boolean;
}

const Users: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" }); // تحديد إذا كان العرض من موبايل

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

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
            setTogglingUserId(userId);
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
              const authToken = token ? token.split("=")[1] : "";

              await axios.put(
                `${API_BASE_URL}/users/${userId}`,
                { isActive: !currentStatus },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );

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
              setTogglingUserId(null);
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
            setIsDeleting(true);
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
              const authToken = token ? token.split("=")[1] : "";

              await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });

              setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userId)
              );
              toast.success("تم حذف المستخدم بنجاح!");
            } catch (error) {
              console.error("فشل في حذف المستخدم:", error);
              toast.error("حدث خطأ أثناء محاولة حذف المستخدم.");
            } finally {
              setIsDeleting(false);
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
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
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

  const tableData = users.map((user, index) => ({
    displayId: index + 1,
    id: user.id,
    fullName: user.fullName,
    governorate: user.governorate,
    role: user.role,
    email: user.email,
    phoneNO: user.phoneNO,
    address: user.address,
    isActive: user.isActive,
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

  const tableColumns: Column<User>[] = [
    { title: "#", accessor: "displayId" },
    { title: "اسم المستخدم", accessor: "fullName" },
    { title: "المحافظة", accessor: "governorate" },
    { title: "نوع المستخدم", accessor: "role" },
    { title: "البريد الالكتروني", accessor: "email" },
    { title: "رقم الهاتف", accessor: "phoneNO" },
    { title: "العنوان", accessor: "address" },
    {
      title: "الحالة",
      render: (item: User) => (
        <div className="flex items-center justify-center">
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${
              item.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <Switch
            onChange={() => handleToggleActive(item.id, item.isActive)}
            checked={item.isActive}
            onColor="#4A90E2"
            offColor="#FF6347"
            height={20}
            width={40}
            disabled={togglingUserId === item.id || isDeleting}
          />
          {togglingUserId === item.id && (
            <ClipLoader color="#4A90E2" size={15} className="ml-2" />
          )}
        </div>
      ),
    },
    {
      title: "العمليات",
      render: (item: User) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleDeleteUser(item.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ClipLoader color="#FF6347" size={15} />
            ) : (
              <FaTrash
                className={`ms-2 ${
                  isDeleting
                    ? "text-gray-400"
                    : "text-red-500 hover:text-red-700"
                }`}
              />
            )}
          </button>
          <button onClick={() => handleViewUser(item)}>
            <FaEye className="text-green-500 hover:text-green-700" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={`p-5 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">إدارة المستخدمين</h2>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => openEditModal(user)} // تمرير الدالة مع userId
              onDelete={() => handleDeleteUser(user.id)} // تمرير دالة الحذف
              onView={() => handleViewUser(user)} // تمرير دالة العرض
              onToggleActive={() => handleToggleActive(user.id, user.isActive)} // تمرير دالة التبديل
            />
          ))}
        </div>
      ) : (
        <GenericTable data={tableData} columns={tableColumns} />
      )}

      {selectedUser && (
        <UserDetails user={selectedUser} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default Users;
