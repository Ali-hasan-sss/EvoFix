"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import GenericTable, { Column } from "@/components/dashboard/GenericTable";
import { API_BASE_URL } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { FaTrashAlt, FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Switch from "react-switch";
import UserDetails from "./UserDetails";
import Modal from "react-modal";
import { Technician } from "@/utils/types";
import { ThemeContext } from "../ThemeContext";
import { useMediaQuery } from "react-responsive";
import UserCard from "./UserCard";
import { ClipLoader } from "react-spinners";

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

const Technicians: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Technician | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);

  const openEditModal = (user: Technician) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchTechnicians = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users/technicians`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTechnicians(response.data.adminTechnicians || []);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
          ? (axiosError.response.data as { message: string }).message
          : "حدث خطأ أثناء جلب البيانات.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  const handleToggleActive = async (id: number, isActive: boolean) => {
    confirmAlert({
      title: "تأكيد التفعيل/التعطيل",
      message: "هل أنت متأكد من تغيير حالة هذا التقني؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setTogglingUserId(id);
            try {
              await axiosInstance.put(`${API_BASE_URL}/users/${id}`, {
                isActive: !isActive,
              });
              fetchTechnicians();
              toast.success("تم تعديل حالة التقني بنجاح");
            } catch (error) {
              toast.error("فشل في تعديل حالة التقني");
            } finally {
              setTogglingUserId(null);
            }
          },
        },
        {
          label: "لا",
        },
      ],
    });
  };

  const deleteTechnician = async (id: number) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد من حذف هذا التقني؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setIsDeleting(true);
            try {
              await axiosInstance.delete(`${API_BASE_URL}/users/${id}`);
              fetchTechnicians();
              toast.success("تم حذف التقني بنجاح");
            } catch (error) {
              toast.error("فشل في حذف التقني");
            } finally {
              setIsDeleting(false);
            }
          },
        },
        {
          label: "لا",
        },
      ],
    });
  };

  const handleViewUser = (user: Technician) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  const tableData = technicians.map((user, index) => ({
    displayId: index + 1, // تأكد من أن هذا الرقم موجود
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
        <button onClick={() => deleteTechnician(user.id)} disabled={isDeleting}>
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

  const columns: Column<Technician>[] = [
    { title: "الاسم الكامل", accessor: "fullName" },
    { title: "البريد الإلكتروني", accessor: "email" },
    { title: "رقم الهاتف", accessor: "phoneNO" },
    {
      title: "الخدمات",
      render: (technician) => technician.technician?.services || "غير متوفر",
    },
    {
      title: "الحالة",
      render: (technician) => (
        <Switch
          onChange={() =>
            handleToggleActive(technician.id, technician.isActive)
          }
          checked={technician.isActive}
          onColor="#4A90E2"
          offColor="#FF6347"
          height={20}
          width={40}
          disabled={togglingUserId === technician.id || isDeleting}
        />
      ),
    },
    {
      title: "إجراءات",
      render: (technician) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => deleteTechnician(technician.id)}
            className="text-red-500 hover:text-red-700"
            title="حذف"
            disabled={isDeleting}
          >
            <FaTrashAlt />
          </button>
          <button onClick={() => handleViewUser(technician)}>
            <FaEye className="text-green-500 hover:text-green-700" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={`p-5 mt-5 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">إدارة التقنيين</h2>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {technicians.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => openEditModal(user)}
              onDelete={() => deleteTechnician(user.id)}
              onView={() => handleViewUser(user)}
              onToggleActive={() => handleToggleActive(user.id, user.isActive)}
            />
          ))}
        </div>
      ) : (
        <GenericTable data={tableData} columns={columns} />
      )}

      {selectedUser && (
        <UserDetails user={selectedUser} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default Technicians;
