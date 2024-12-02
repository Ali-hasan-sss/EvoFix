import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/context/ThemeContext";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  title: string;
  DevicesModels: { id: string; title: string }[];
}
interface requestbuttonProps {
  update: () => void;
}

const RepairRequestButton: React.FC<requestbuttonProps> = ({ update }) => {
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
  const [services, setServices] = useState<Service[]>([]);
  const [hasFetchedServices, setHasFetchedServices] = useState(false); // new state to track if services are fetched

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setDeviceImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };
  const router = useRouter();

  const removeImage = () => {
    setDeviceImage(null);
    setImagePreview(null);
  };

  const DeviceTypeSelector: React.FC<{
    deviceType: string;
    setDeviceType: (type: string) => void;
    setDeviceModels: (models: { id: string; title: string }[]) => void;
  }> = ({ deviceType, setDeviceType, setDeviceModels }) => {
    const fetchServices = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const response = await axios.get(`${API_BASE_URL}/services`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setServices(response.data.services || []);
        setHasFetchedServices(true); // Mark services as fetched
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الخدمات:", error);
      }
    };

    useEffect(() => {
      if (isModalOpen && !hasFetchedServices) {
        fetchServices(); // Fetch services only if not already fetched
      }
    }, [isModalOpen, hasFetchedServices]); // Dependency array now includes `hasFetchedServices`

    const handleDeviceTypeChange = (type: string) => {
      setDeviceType(type);
      // العثور على الخدمة المحددة وتحديث الموديلات المرتبطة بها
      const selectedService = services.find(
        (service) => service.title === type
      );
      setDeviceModels(selectedService ? selectedService.DevicesModels : []);
      setDeviceModel(""); // مسح الموديل المحدد عند تغيير نوع الجهاز
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

  const openModal = () => {
    if (!isLoggedIn) {
      router.push("/login"); // تحويل المستخدم إلى صفحة تسجيل الدخول
    } else {
      setIsModalOpen(true); // فتح النافذة إذا كان المستخدم مسجلًا
    }
  };
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
      update();
      if (response.status >= 200 && response.status <= 299) {
        // الطلب ناجح
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
        // إذا كان الكود خارج النطاق الناجح
        console.log("فشل في إرسال الطلب");
        toast.error("فشل في إرسال الطلب");
      }
    } catch (error) {
      // تحقق مما إذا كان الخطأ يحتوي على استجابة من الخادم
      if (axios.isAxiosError(error) && error.response) {
        const { message, suggestions } = error.response.data;

        // عرض الرسالة الأساسية من الخادم
        toast.error(message || "حدث خطأ أثناء إرسال الطلب");

        // إذا كانت هناك اقتراحات، عرضها واحدة تلو الأخرى
        if (suggestions && Array.isArray(suggestions)) {
          suggestions.forEach((suggestion) =>
            toast.error(`اقتراح: ${suggestion}`)
          );
        }
      } else {
        // في حال كان الخطأ عام وغير متصل بالخادم
        console.error("حدث خطأ:", error);
        toast.error("حدث خطأ أثناء إرسال الطلب");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <button
        onClick={openModal}
        className={`fixed bottom-20 mb-5 left-5 bg-blue-400 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-20  ${
          isDarkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-blue-500 text-black hover:bg-blue-600"
        }`}
      >
        طلب إصلاح
      </button>

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
                  <option value="درعا">درعا</option>
                  <option value="حمص">حمص</option>
                  <option value="حماه">حماه</option>
                  <option value="طرطوس">طرطوس</option>
                  <option value="اللاذقية">اللاذقية</option>
                  <option value="السويداء">السويداء</option>
                  <option value="القنيطرة">القنيطرة</option>
                  <option value="حلب">حلب</option>
                  <option value="الرقة">الرقة</option>
                  <option value="دير الزور">دير الزور</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block">رقم الهاتف</label>
                <input
                  type="text"
                  value={phoneNO}
                  onChange={(e) => setPhoneNO(e.target.value)}
                  className={`w-full p-2 border-b focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block">العنوان</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full p-2 border-b focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  required
                />
              </div>

              <DeviceTypeSelector
                deviceType={deviceType}
                setDeviceType={setDeviceType}
                setDeviceModels={setDeviceModels}
              />

              <div className="mb-4">
                <label className="block">الموديل</label>
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
                  <option value="">اختر الموديل</option>
                  {deviceModels.map((model) => (
                    <option key={model.id} value={model.title}>
                      {model.title}
                    </option>
                  ))}
                </select>
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
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block">صورة الجهاز</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border-b focus:outline-none"
                />
                {imagePreview && (
                  <div className="mt-2 flex items-center">
                    <Image
                      src={imagePreview}
                      alt="معاينة الصورة"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-red-500 ml-2"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between ">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white p-2 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-blue-500 text-white p-2 rounded-lg ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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
