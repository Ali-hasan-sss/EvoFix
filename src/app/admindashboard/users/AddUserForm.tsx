import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // تأكد من أنك قد قمت بتثبيت مكتبة react-toastify
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../../ThemeContext";

interface AddUserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
}

interface UserFormData {
  fullName: string;
  phoneNO: string;
  email: string;
  governorate: string;
  address: string;
  role: "USER" | "SUB_ADMIN" | "TECHNICAL";
  specialization?: string;
  services?: string;
  password: string;
}

interface Service {
  title: string;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    phoneNO: "",
    email: "",
    governorate: "دمشق",
    address: "",
    role: "USER",
    password: "",
  });

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // حالة التحميل
  const { isDarkMode } = useContext(ThemeContext);
  const userRole = localStorage.getItem("userRole");

  // Fetch specializations from the API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/services`)
      .then((response) => {
        if (response.data.services && Array.isArray(response.data.services)) {
          const titles = response.data.services.map(
            (service: Service) => service.title
          );
          setSpecializations(titles);
        }
      })
      .catch((error) => console.error("فشل في جلب الخدمات:", error));
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // بدء التحميل
    try {
      await onSubmit(formData);
      toast.success("تم إضافة المستخدم بنجاح!");
      onClose(); // أغلق المودال بعد الإضافة الناجحة
    } catch (error) {
      console.error("خطأ أثناء إضافة المستخدم:", error);
      toast.error("حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false); // انتهاء التحميل
    }
  };

  return (
    <div
      className={`overflow-y-auto max-h-screen ${
        isDarkMode ? "bg-gray-800" : "bg-gray-200"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-4 rounded-lg shadow-md flex flex-col gap-y-2 md:grid md:grid-cols-2 gap-x-4 ${
          isDarkMode ? "text-light" : "text-black"
        }`}
      >
        <div className="mb-2">
          <label className="block">الاسم الكامل:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-2">
          <label className="block">رقم الهاتف:</label>
          <input
            type="text"
            name="phoneNO"
            value={formData.phoneNO}
            onChange={handleChange}
            required
            className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block">البريد الإلكتروني:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block">المحافظة:</label>
          <select
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            required
            className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="mb-4">
          <label className="block">العنوان:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            minLength={10}
            className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block">نوع المستخدم:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">مستخدم</option>
            <option value="TECHNICAL">تقني</option>
            {userRole === "ADMIN" && <option value="ADMIN">مدير</option>}
            {userRole === "ADMIN" && (
              <option value="SUBADMIN">مدير محافظة </option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block">كلمة المرور:</label>
          <input
            type="password" // تأكد من نوع الحقل هو password
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {formData.role === "TECHNICAL" && (
          <>
            <div className="mb-4">
              <label className="block">الاختصاص:</label>
              <select
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الاختصاص</option>
                {specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block">الخدمات:</label>
              <input
                type="text"
                name="services"
                value={formData.services || ""}
                onChange={handleChange}
                required
                className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading} // تعطيل الزر أثناء التحميل
          className={`mt-4 w-full p-2 text-white rounded-md ${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          } focus:outline-none`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-3 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v10" />
                <path d="M2 12h10" />
              </svg>
              جار التحميل...
            </span>
          ) : (
            "إضافة المستخدم"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
