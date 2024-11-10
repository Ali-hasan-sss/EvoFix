import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";
import { Service, DeviceModel } from "@/utils/types";

interface DeviceModelFormProps {
  initialData?: DeviceModel | null;
  onSubmit: (data: DeviceModel) => Promise<void>;
  isActive: boolean;
  onClose: () => void;
  services: Service[];
}

const DeviceModelForm: React.FC<DeviceModelFormProps> = ({
  initialData,
  onSubmit,
  onClose,
  isActive, // استقبال isActive من المكون الأب
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [serviceID, setServiceID] = useState(initialData?.serviceID || 0);
  const [active, setActive] = useState(isActive); // حقل لحالة النشاط
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const response = await axios.get(`${API_BASE_URL}/services`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setServices(response.data.services || []);
      } catch (error) {
        toast.error("حدث خطأ أثناء جلب الخدمات.");
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        id: initialData ? initialData.id : 0,
        title,
        serviceID,
        createAt: new Date().toISOString(),
        isActive: active, // إرسال حالة النشاط
        services: [],
      });
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-gray-800 rounded border border-yellow-600 text-white"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium">العنوان</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 p-2 block w-full border text-black rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">الخدمة</label>
        <select
          value={serviceID}
          onChange={(e) => setServiceID(Number(e.target.value))}
          required
          className="mt-1 p-2 block w-full border text-black rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        >
          <option value="">اختر خدمة</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="inline ml-1 text-sm font-medium">الموديل نشط</label>
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="mt-1"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="bg-red-400 text-gray-700 px-4 py-2 rounded mr-2"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </div>
    </form>
  );
};

export default DeviceModelForm;
