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
  const [selectedTab, setSelectedTab] = useState("users"); // التبويب الحالي
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";
      const endpoint =
        selectedTab === "technicians"
          ? "/users/technicians"
          : selectedTab === "subAdmins"
          ? "/users/subAdmins"
          : "/users";

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // تحديد المصفوفة المناسبة بناءً على التبويب المحدد
      if (selectedTab === "technicians") {
        setUsers(response.data.adminTechnicians || []);
      } else if (selectedTab === "subAdmins") {
        setUsers(response.data.adminSubAdmins || []);
      } else {
        setUsers(response.data || []);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "فشل في جلب البيانات");
      } else {
        setError("حدث خطأ غير معروف");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedTab]);

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

  const tableData = Array.isArray(users)
    ? users.map((user, index) => ({
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
            <button onClick={() => openEditModal(user)}>
              <FaEdit className="text-blue-500 hover:text-blue-700" />
            </button>
            <button
              onClick={() => handleDeleteUser(user.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ClipLoader color="#FF6347" size={15} />
              ) : (
                <FaTrash className="text-red-500 hover:text-red-700" />
              )}
            </button>
            <button onClick={() => handleViewUser(user)}>
              <FaEye className="text-green-500 hover:text-green-700" />
            </button>
          </div>
        ),
      }))
    : [];

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
        <Switch
          onChange={() => handleToggleActive(item.id, item.isActive)}
          checked={item.isActive}
          onColor="#4A90E2"
          offColor="#FF6347"
          height={20}
          width={40}
          disabled={togglingUserId === item.id || isDeleting}
        />
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
              <FaTrash className="text-red-500 hover:text-red-700" />
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
    <div className={`p-5 mt-5 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">إدارة المستخدمين</h2>

      {/* التبويبات */}
      <div className="flex justify-center  mb-4">
        <button
          onClick={() => setSelectedTab("users")}
          className={`px-4 py-2  ${
            selectedTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          المستخدمين
        </button>
        <button
          onClick={() => setSelectedTab("technicians")}
          className={`px-4 py-2 mx-2 ${
            selectedTab === "technicians"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          التقنيين
        </button>
        <button
          onClick={() => setSelectedTab("subAdmins")}
          className={`px-4 py-2 ${
            selectedTab === "subAdmins"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          مدراء المحافظات
        </button>
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.isArray(users) ? (
            users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={() => openEditModal(user)}
                onDelete={() => handleDeleteUser(user.id)}
                onView={() => handleViewUser(user)}
                onToggleActive={() =>
                  handleToggleActive(user.id, user.isActive)
                }
              />
            ))
          ) : (
            <p>لا يوجد مستخدمون لعرضهم.</p>
          )}
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
