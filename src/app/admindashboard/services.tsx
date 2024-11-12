"use client";

import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";
import ServiceForm from "@/components/forms/ServiceForm";
import Switch from "@mui/material/Switch";
import { confirmAlert } from "react-confirm-alert";
import { FiEdit, FiTrash } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { useRepairRequests } from "@/app/context/adminData";

interface DeviceModel {
  id: number;
  serviceID: number | null;
  title: string;
  isActive: boolean;
  createAt: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  serviceImage: string;
  isActive: boolean;
  createAt: string;
  DevicesModels: DeviceModel[];
}

const ServicesComponent: React.FC = () => {
  // State hooks for managing services data, modal visibility, loading, etc.
  const { fetchServices, services, isServicesLoading } = useRepairRequests();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicess, setServicess] = useState<Service[]>([]);

  // Function to retrieve the authorization token from cookies
  const getAuthToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return token ? token.split("=")[1] : "";
  };
  //
  useEffect(() => {
    if (services) {
      setServicess(services);
    }
  }, [services]);

  // Handler for adding a new service
  const handleAddService = async (data: {
    title: string;
    description: string;
    serviceImage: File | null;
  }) => {
    setLoading(true);
    try {
      const authToken = getAuthToken();
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.serviceImage) {
        formData.append("serviceImage", data.serviceImage);
      }

      // إرسال الطلب لإضافة الخدمة
      const response = await axios.post(`${API_BASE_URL}/services`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // إضافة الخدمة الجديدة إلى القائمة المحلية
      setServicess((prevServices) => [response.data.service, ...prevServices]);

      toast.success("تمت إضافة الخدمة بنجاح!");
      handleCloseModal();
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الخدمة.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for editing an existing service
  const handleEditService = async (data: {
    title: string;
    description: string;
    serviceImage: File | null;
  }) => {
    setLoading(true);
    try {
      const authToken = getAuthToken();
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.serviceImage) {
        formData.append("serviceImage", data.serviceImage);
      }

      const response = await axios.put(
        `${API_BASE_URL}/services/${editingService?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // تحديث الخدمة في الحالة المحلية
      setServicess((prevServices) =>
        prevServices.map((service) =>
          service.id === editingService?.id
            ? { ...service, ...response.data.serviceUpdate }
            : service
        )
      );

      toast.success("تم تعديل الخدمة بنجاح!");
      handleCloseModal();
      setEditingService(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء تعديل الخدمة.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a service with confirmation
  const handleDeleteService = async (id: number) => {
    setLoading(true);
    const authToken = getAuthToken();
    try {
      await axios.delete(`${API_BASE_URL}/services/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // إزالة الخدمة من الحالة المحلية
      setServicess((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );

      toast.success("تم حذف الخدمة بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الخدمة.");
    } finally {
      setLoading(false);
    }
  };

  // Confirmation before deletion
  const confirmDeleteService = (id: number) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذه الخدمة؟",
      buttons: [
        {
          label: "نعم",
          onClick: () => handleDeleteService(id),
        },
        {
          label: "إلغاء",
        },
      ],
    });
  };

  // Toggle active state of a service
  const handleToggleActive = async (service: Service) => {
    setLoading(true);
    const authToken = getAuthToken();
    try {
      const isActiveValue = service.isActive ? "false" : "true";

      await axios.put(
        `${API_BASE_URL}/services/${service.id}`,
        { isActive: isActiveValue },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // تحديث حالة النشاط في الحالة المحلية
      setServicess((prevServices) =>
        prevServices.map((prevService) =>
          prevService.id === service.id
            ? { ...prevService, isActive: !prevService.isActive }
            : prevService
        )
      );

      toast.success("تم تغيير حالة الخدمة بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير حالة الخدمة.");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding/editing a service
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setShowServiceForm(true);
  };
  // Close modal and reset state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowServiceForm(false);
  };

  return (
    <div className="p-4 pt-6">
      <h2 className="text-xl font-bold">إدارة الخدمات</h2>

      <div className="my-4">
        <button
          onClick={() => {
            setEditingService(null);
            handleOpenModal();
          }}
          className="bg-blue-500 text-white rounded p-2"
        >
          إضافة خدمة جديدة
        </button>
      </div>

      {isServicesLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#4A90E2" loading={loading} size={50} />
        </div>
      ) : servicess && servicess.length > 0 ? (
        <ul>
          {servicess.map((service) => (
            <li
              key={service.id}
              className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 p-4 border rounded"
            >
              <div className="flex items-center">
                <Image
                  src={service.serviceImage}
                  alt={service.title}
                  width={64}
                  height={64}
                  className="rounded"
                />
                <div className="mr-4">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {service.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    تاريخ الإنشاء:{" "}
                    {new Date(service.createAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        service.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <Switch
                      checked={service.isActive}
                      onChange={() => handleToggleActive(service)}
                      color="primary"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    الموديلات المتاحة:{" "}
                    {service.DevicesModels &&
                    Array.isArray(service.DevicesModels)
                      ? service.DevicesModels.map(
                          (device) => device.title
                        ).join(", ")
                      : "لا توجد موديلات متاحة"}
                  </p>
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                <button
                  className="ml-4"
                  onClick={() => {
                    setEditingService(service);
                    handleOpenModal();
                  }}
                  disabled={loading}
                >
                  <FiEdit className="text-yellow-500 text-xl " />
                </button>
                <button
                  onClick={() => confirmDeleteService(service.id)}
                  disabled={loading}
                >
                  <FiTrash className="text-red-500 text-xl" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>لا توجد خدمات متاحة حاليا.</p>
      )}

      {/* Modal for add/edit form */}
      {showServiceForm && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          ariaHideApp={false}
          className="rounded shadow-lg"
          overlayClassName="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <ServiceForm
            initialData={
              editingService
                ? {
                    title: editingService.title,
                    description: editingService.description,
                    serviceImage: null,
                  }
                : undefined
            }
            onSubmit={editingService ? handleEditService : handleAddService}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ServicesComponent;
