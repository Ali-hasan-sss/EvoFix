"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import GenericTable, { Column } from "@/components/dashboard/GenericTable";
import { API_BASE_URL } from "@/utils/api";
import { toast } from "react-toastify";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Switch from "react-switch"; // استيراد Switch من مكتبة react-switch
import UserDetails from "./UserDetails";
import Modal from "react-modal"; // لإدارة المودال
import { User, Technician } from "@/utils/types";
import { ThemeContext } from "../ThemeContext";

const Technicians: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Technician | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = Cookies.get("token");

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
      setIsLoading(false);
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
            setTogglingUserId(id); // تعيين ID المستخدم الجاري تعديل حالته
            try {
              await axiosInstance.put(`${API_BASE_URL}/users/${id}`, {
                isActive: !isActive,
              });
              fetchTechnicians();
              toast.success("تم تعديل حالة التقني بنجاح");
            } catch (error) {
              toast.error("فشل في تعديل حالة التقني");
            } finally {
              setTogglingUserId(null); // إعادة تعيين الحالة
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
            setIsDeleting(true); // تحديد حالة الحذف
            try {
              await axiosInstance.delete(`${API_BASE_URL}/users/${id}`);
              fetchTechnicians();
              toast.success("تم حذف التقني بنجاح");
            } catch (error) {
              toast.error("فشل في حذف التقني");
            } finally {
              setIsDeleting(false); // إعادة تعيين حالة الحذف
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
    setSelectedUser(user); // تعيين الفني المحدد لعرض التفاصيل في المودال
    setIsModalOpen(true); // فتح المودال
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setIsModalOpen(false); // إغلاق المودال
  };

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
            className="text-red-500 hover:text-red-700 ml-3"
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
    <>
      <div className={`p-5 mt-5 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
        <h2 className="text-2xl font-semibold mb-4">إدارة التقنيين</h2>

        <GenericTable<Technician>
          data={technicians}
          columns={columns}
          isLoading={isLoading}
        />

        {/* مودال عرض تفاصيل المستخدم */}
        {selectedUser && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseDetails}
            contentLabel="تفاصيل المستخدم"
            ariaHideApp={false}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <UserDetails
              user={selectedUser}
              onClose={() => setIsModalOpen(false)}
            />
            <button onClick={handleCloseDetails}>إغلاق</button>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Technicians;
