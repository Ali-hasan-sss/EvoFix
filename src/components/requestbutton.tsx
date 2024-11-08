import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/context/ThemeContext";
import Image from "next/image";
import toast from "react-hot-toast";

interface Service {
  id: string;
  title: string;
  DevicesModels: { id: string; title: string }[];
}

const RepairRequestButton: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [governorate, setGovernorate] = useState("");
  const [phoneNO, setPhoneNO] = useState("");
  const [address, setAddress] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceModels, setDeviceModels] = useState<
    { id: string; title: string }[]
  >([]);
  const [problemDescription, setProblemDescription] = useState("");
  const [deviceImage, setDeviceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setDeviceImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const removeImage = () => {
    setDeviceImage(null);
    setImagePreview(null);
  };

  const DeviceTypeSelector: React.FC<{
    deviceType: string;
    setDeviceType: (type: string) => void;
    setDeviceModels: (models: { id: string; title: string }[]) => void;
  }> = ({ deviceType, setDeviceType, setDeviceModels }) => {
    const [services, setServices] = useState<Service[]>([]);

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
          console.error("حدث خطأ أثناء جلب الخدمات:", error);
        }
      };

      fetchServices();
    }, []);

    const handleDeviceTypeChange = (type: string) => {
      setDeviceType(type);

      const selectedService = services.find(
        (service) => service.title === type
      );
      setDeviceModels(selectedService ? selectedService.DevicesModels : []);
    };

    return (
      <div className="mb-4">
        <label className="block">نوع الجهاز</label>
        <select
          value={deviceType}
          onChange={(e) => handleDeviceTypeChange(e.target.value)}
          className={`w-full p-2 border-b focus:outline-none ${
            isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          }`}
          required
        >
          <option value="">اختر نوع الجهاز</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = Cookies.get("token");

    const formData = new FormData();
    formData.append("governorate", governorate);
    formData.append("phoneNO", phoneNO);
    formData.append("address", address);
    formData.append("deviceType", deviceType);
    formData.append("deviceModel", deviceModel);
    formData.append("problemDescription", problemDescription);

    if (deviceImage) {
      formData.append("deviceImage", deviceImage);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/maintenance-requests`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("تم إرسال الطلب بنجاح!");
        setGovernorate("");
        setPhoneNO("");
        setAddress("");
        setDeviceType("");
        setDeviceModel("");
        setProblemDescription("");
        removeImage();
        closeModal();
      } else {
        console.log("فشل في إرسال الطلب");
      }
    } catch (error) {
      console.error("حدث خطأ:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-20 mb-5 left-5 bg-blue-400 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-20"
      >
        طلب إصلاح
      </button>
      {!isLoggedIn && isModalOpen && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className={`p-6 rounded-lg shadow-lg w-11/12 sm:w-96 ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
              }`}
              style={{ maxHeight: "80%", overflowY: "auto" }}
            >
              <p>
                يجب عليك
                <a href="/login" className="text-blue-500">
                  تسجيل الدخول
                </a>
                لارسال طلب اصلاح
              </p>
              <button
                type="button"
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-600 mt-4 text-white px-4 py-2 rounded-lg focus:outline-none"
              >
                إلغاء
              </button>
            </div>
          </div>
        </>
      )}

      {isLoggedIn && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-11/12 sm:w-96 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
            }`}
            style={{ maxHeight: "80%", overflowY: "auto" }}
          >
            <h2 className="text-lg font-semibold mb-4">طلب إصلاح</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block">المحافظة</label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className={`w-full p-2 border-b focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  required
                >
                  <option value="">اختر المحافظة</option>
                  <option value="دمشق">دمشق</option>
                  <option value="ريف دمشق">ريف دمشق</option>
                  <option value="حمص">حمص</option>
                  <option value="حماه">حماه</option>
                  <option value="طرطوس">طرطوس</option>
                  <option value="اللاذقية">اللاذقية</option>
                  <option value="السويداء">السويداء</option>
                  <option value="القنيطرة">القنيطرة</option>
                  <option value="حلب">حلب</option>
                  <option value="الرقة">الرقة</option>
                  <option value="الحسكة">الحسكة</option>
                  <option value="دير الزور">دير الزور</option>
                  <option value="ادلب">ادلب</option>
                </select>
              </div>

              {/* حقل اختيار نوع الجهاز */}
              <DeviceTypeSelector
                deviceType={deviceType}
                setDeviceType={setDeviceType}
                setDeviceModels={setDeviceModels}
              />

              <div className="mb-4">
                <label className="block">موديل الجهاز</label>
                <select
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  className={`w-full p-2 border-b focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  required
                >
                  <option value="">اختر موديل الجهاز</option>
                  {deviceModels.map((model) => (
                    <option key={model.id} value={model.title}>
                      {model.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block">صورة الجهاز</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="معاينة صورة الجهاز"
                      width={500}
                      height={128}
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="mt-2 text-red-500 hover:underline"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block">وصف المشكلة</label>
                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className={`w-full p-2 border-b focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 hover:bg-red-600 mr-4 text-white px-4 py-2 rounded-lg focus:outline-none"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الإرسال..." : "إرسال"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RepairRequestButton;
