import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { API_BASE_URL } from "@/utils/api";
import DeviceModelForm from "@/components/forms/DeviceModelForm";
import { ClipLoader } from "react-spinners";
import { Switch } from "@mui/material";
import { FiEdit, FiTrash } from "react-icons/fi";
import { confirmAlert } from "react-confirm-alert";
import { DeviceModel } from "@/utils/types";
import { useRepairRequests } from "@/app/context/adminData";

const DevicesModels: React.FC = () => {
  const {
    deviceModels: contextDeviceModels,
    fetchDeviceModels,
    isDeviceLoading,
  } = useRepairRequests();
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);

  useEffect(() => {
    setDeviceModels(contextDeviceModels);
  }, [contextDeviceModels]);

  const handleSaveModel = async (data: DeviceModel) => {
    try {
      const authToken = Cookies.get("token");

      if (selectedModel) {
        // تعديل موديل موجود
        await axios.put(
          `${API_BASE_URL}/device-models/${selectedModel.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        toast.success("تم تعديل الموديل بنجاح!");

        // تحديث الموديل المعدل محليًا
        setDeviceModels((prev) =>
          prev.map((model) => (model.id === selectedModel.id ? data : model))
        );
      } else {
        // إضافة موديل جديد
        const response = await axios.post(
          `${API_BASE_URL}/device-models`,
          data,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        toast.success(response.data.message || "تم إضافة الموديل بنجاح");

        // إضافة الموديل الجديد محليًا باستخدام البيانات المستلمة من السيرفر
        setDeviceModels((prev) => [response.data.device_model, ...prev]);
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error("حدث خطأ غير متوقع، الرجاء المحاولة لاحقًا");
    }
  };

  const handleEditModel = (model: DeviceModel) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  const confirmDeleteModel = (id: number) => {
    confirmAlert({
      title: "تاكيد الحذف",
      message: "هل انت متاكد من حذف الموديل ؟",
      buttons: [
        { label: "نعم", onClick: () => handleDeleteModel(id) },
        { label: "لا" },
      ],
    });
  };

  const handleDeleteModel = async (id: number) => {
    try {
      const authToken = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/device-models/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("تم حذف الموديل بنجاح");

      // حذف الموديل من الحالة المحلية
      setDeviceModels((prev) => prev.filter((model) => model.id !== id));
    } catch (error) {
      toast.error("حدث خطأ اثناء الحذف");
      console.error(error);
    }
  };

  const handleToggleActive = async (model: DeviceModel) => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const isActiveValue = !model.isActive;

      await axios.put(
        `${API_BASE_URL}/device-models/${model.id}`,
        { isActive: isActiveValue },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("تم تحديث حالة النشر!");

      // تحديث حالة النشاط محليًا
      setDeviceModels((prev) =>
        prev.map((m) =>
          m.id === model.id ? { ...m, isActive: isActiveValue } : m
        )
      );
    } catch (error) {
      toast.error("حدث خطا غير متوقع.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isDeviceLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">موديلات الاجهزة</h2>
      <button
        onClick={() => {
          setSelectedModel(null);
          setIsModalOpen(true);
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        اضافة موديل جديد
      </button>
      {deviceModels.length > 0 ? (
        <ul className="mt-4">
          {deviceModels.map((model) => (
            <li
              key={model.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 border rounded shadow"
            >
              <div>
                <h3 className="text-lg font-semibold">{model.title}</h3>
                <p className="text-sm text-gray-600">
                  Status: {model.isActive ? "Active" : "Inactive"}
                </p>
                <p className="text-sm text-gray-500">
                  Created At:{" "}
                  {model.createAt
                    ? new Date(model.createAt).toLocaleDateString()
                    : "Not available"}
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
                  <FiEdit className="text-yellow-500 text-xl" />
                </button>
                <button
                  onClick={() => confirmDeleteModel(model.id)}
                  disabled={loading}
                >
                  <FiTrash className="text-red-500 text-xl" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No device models available currently.</p>
      )}
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
            initialData={selectedModel}
            services={selectedModel?.services || []}
            isActive={selectedModel ? !!selectedModel.isActive : false} // تمرير isActive
          />
        </Modal>
      )}
    </div>
  );
};

export default DevicesModels;
