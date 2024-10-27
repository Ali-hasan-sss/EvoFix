"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { API_BASE_URL } from "@/utils/api";
import DeviceModelForm from "@/components/forms/DeviceModelForm";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { Switch } from "@mui/material";
import { FiEdit, FiTrash } from "react-icons/fi";
import { confirmAlert } from "react-confirm-alert";
import { DeviceModel } from "@/utils/types";

const DevicesModels: React.FC = () => {
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null); // لتمرير البيانات إلى النموذج عند التعديل

  const fetchDeviceModels = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/device-models`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Fetched Device Models:", response.data.DeviceModel); // تحقق من البيانات
      setDeviceModels(response.data.DeviceModel || []); // تحديث الحالة هنا
      // قم بإزالة console.log الخاص بـ deviceModels
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
          ? (axiosError.response.data as { message: string }).message
          : "حدث خطأ أثناء جلب موديلات الأجهزة.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeviceModels();
  }, [fetchDeviceModels]);

  const handleSaveModel = async (data: DeviceModel) => {
    try {
      const authToken = Cookies.get("token");
      if (selectedModel) {
        // تعديل الموديل الحالي باستخدام PUT
        await axios.put(
          `${API_BASE_URL}/device-models/${selectedModel.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        toast.success("تم تعديل الموديل بنجاح!");
      } else {
        // إضافة موديل جديد باستخدام POST
        await axios.post(`${API_BASE_URL}/device-models`, data, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        toast.success("تمت إضافة موديل جديد بنجاح!");
      }
      setIsModalOpen(false);
      fetchDeviceModels(); // تحديث قائمة الموديلات بعد التعديل أو الإضافة
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الموديل.");
    }
  };

  const handleEditModel = (model: DeviceModel) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  const confirmDeleteModel = (id: number) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذه الخدمة؟",
      buttons: [
        {
          label: "نعم",
          onClick: () => handleDeleteModel(id),
        },
        {
          label: "إلغاء",
        },
      ],
    });
  };

  const handleDeleteModel = async (id: number) => {
    try {
      const authToken = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/device-models/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("تم حذف الموديل بنجاح!");
      fetchDeviceModels(); // تحديث قائمة الموديلات بعد الحذف
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الموديل.");
    }
  };

  const handleToggleActive = async (model: DeviceModel) => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const isActiveValue = model.isActive ? "false" : "true";

      await axios.put(
        `${API_BASE_URL}/device-models/${model.id}`,
        { isActive: isActiveValue },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("تم تغيير حالة الخدمة بنجاح!");
      fetchDeviceModels();
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير حالة الخدمة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">موديلات الأجهزة</h2>

      <button
        onClick={() => {
          setSelectedModel(null);
          setIsModalOpen(true);
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        إضافة موديل جديد
      </button>

      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#4A90E2" loading={loading} size={50} />
        </div>
      ) : (
        <ul className="mt-4">
          {deviceModels.length > 0 ? (
            deviceModels.map((model) => (
              <li
                key={model.id}
                className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 p-4 border rounded shadow"
              >
                <div>
                  <h3 className="text-lg font-semibold">{model.title}</h3>
                  <p className="text-sm text-gray-600">
                    الحالة: {model.isActive ? "نشط" : "غير نشط"}
                  </p>
                  <p className="text-sm text-gray-500">
                    تاريخ الإنشاء:{" "}
                    {model.createAt
                      ? new Date(model.createAt).toLocaleDateString()
                      : "غير متوفر"}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        model.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <Switch
                      checked={model.isActive}
                      onChange={() => handleToggleActive(model)}
                      color="primary"
                    />
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <button
                    className="ml-4"
                    onClick={() => handleEditModel(model)}
                    disabled={loading}
                  >
                    <FiEdit className="text-yellow-500 text-xl " />
                  </button>
                  <button
                    onClick={() => confirmDeleteModel(model.id)}
                    disabled={loading}
                  >
                    <FiTrash className="text-red-500 text-xl" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">لا توجد موديلات متاحة حاليا.</p>
          )}
        </ul>
      )}

      {/* نافذة النموذج */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          ariaHideApp={false}
          className="rounded shadow-lg"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <DeviceModelForm
            onSubmit={handleSaveModel}
            onClose={() => setIsModalOpen(false)}
            initialData={selectedModel} // يمكنك تمرير selectedModel مباشرة
            services={selectedModel?.services || []} // هنا نقوم بتمرير الخدمات
          />
        </Modal>
      )}
    </div>
  );
};

export default DevicesModels;
