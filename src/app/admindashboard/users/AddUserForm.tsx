import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../../context/ThemeContext";

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
  role: "USER" | "SUBADMIN" | "TECHNICAL" | "ADMIN";
  specialization?: string;
  services?: string;
  admin_governorate?: string;
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
    governorate: "",
    address: "",
    role: "USER",
    password: "",
    admin_governorate: "",
    specialization: "",
    services: "",
  });

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isDarkMode } = useContext(ThemeContext);
  const userRole = localStorage.getItem("userRole");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error for the field being changed
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) {
      newErrors.fullName = "يجب إدخال الاسم الكامل.";
    }

    if (!formData.phoneNO) {
      newErrors.phoneNO = "رقم الهاتف مطلوب.";
    } else if (!/^\d{10}$/.test(formData.phoneNO)) {
      newErrors.phoneNO = "ادخل رقم هاتف صالح";
    }

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح.";
    }
    if (!formData.address) {
      newErrors.address = "العنوان مطلوب.";
    } else if (formData.address.length < 10) {
      newErrors.address = "يجب أن يكون العنوان أكثر من 10 أحرف.";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة.";
    } else if (formData.password.length < 8) {
      newErrors.password = "يجب أن تكون كلمة المرور أكثر من 8 أحرف.";
    }

    if (formData.role === "TECHNICAL") {
      if (!formData.specialization) {
        newErrors.specialization = "يجب اختيار الاختصاص.";
      }

      if (!formData.services) {
        newErrors.services = "يجب إدخال الخدمات.";
      }
    }
    if (formData.role === "SUBADMIN") {
      if (!formData.admin_governorate) {
        newErrors.admin_governorate = "حدد قطاع العمل";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success("تم إضافة المستخدم بنجاح!");
      onClose();
    } catch (error) {
      console.error("خطأ أثناء إضافة المستخدم:", error);
      toast.error("حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`overflow-y-auto max-h-screen custom-sidebar-scroll p-2${
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
          {errors.fullName && (
            <span className="text-red-600">{errors.fullName}</span>
          )}
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
          {errors.phoneNO && (
            <span className="text-red-600">{errors.phoneNO}</span>
          )}
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
          {errors.email && <span className="text-red-600">{errors.email}</span>}
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
            className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && (
            <span className="text-red-600">{errors.address}</span>
          )}
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
              <option value="SUBADMIN">مدير محافظة</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block">كلمة المرور:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <span className="text-red-600">{errors.password}</span>
          )}
        </div>

        {formData.role === "TECHNICAL" && (
          <>
            <div className="mb-4">
              <label className="block">الاختصاص:</label>
              <select
                name="specialization"
                onChange={handleChange}
                className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الاختصاص</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <span className="text-red-600">{errors.specialization}</span>
              )}
            </div>

            <div className="mb-4">
              <label className="block">الخدمات:</label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.services && (
                <span className="text-red-600">{errors.services}</span>
              )}
            </div>
          </>
        )}
        {formData.role === "SUBADMIN" && (
          <>
            <div className="mb-4">
              <label className="block">قطاع العمل:</label>
              <select
                name="admin_governorate"
                value={formData.admin_governorate}
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
          </>
        )}

        <button
          type="submit"
          className={`mt-4 p-2 rounded-lg ${
            isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
          } hover:bg-blue-700`}
          disabled={loading}
        >
          {loading ? "جارٍ الإضافة..." : "إضافة مستخدم"}
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
