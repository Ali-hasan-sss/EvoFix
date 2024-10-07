"use client";
import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { ThemeContext } from "@/app/ThemeContext";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

interface FormData {
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  services?: string; // New field for services description
}

interface FormErrors {
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  services?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = {
    fullName: "",
    email: "",
    governorate: "",
    password: "",
    confirmPassword: "",
    phoneNO: "",
    address: "",
    specialization: "",
    services: "", // Initialize services field
  },
  onSubmit,
  submitButtonLabel = "التسجيل",
  isNew = true,
  isUser = true,
  isTechnical = false,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>(initialData);

  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    phoneNO: "",
    governorate: "",
    address: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    services: "", // Initialize services error
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      fullName: "",
      email: "",
      phoneNO: "",
      governorate: "",
      address: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      services: "",
    };

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب";
      if (!formData.email.includes("@"))
        newErrors.email = "البريد الإلكتروني غير صالح";
      if (!formData.phoneNO) newErrors.phoneNO = "رقم الهاتف مطلوب";
    } else if (currentStep === 2) {
      if (!formData.governorate) newErrors.governorate = "المحافظة مطلوبة";
      if (isTechnical && !formData.specialization)
        newErrors.specialization = "الاختصاص مطلوب";
      if (isTechnical && !formData.services)
        newErrors.services = "وصف الخدمة مطلوب"; // Validate services field
    } else if (currentStep === 3) {
      if (!formData.address) newErrors.address = "العنوان مطلوب";
      if (formData.password.length < 8)
        newErrors.password = "كلمة المرور يجب أن تكون على الأقل 8 أحرف";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (!isValid) {
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="fullName" className="block font-bold mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } ${errors.fullName ? "border-red-500" : ""}`}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNO" className="block font-bold mb-2">
                رقم الهاتف
              </label>
              <input
                type="text"
                id="phoneNO"
                name="phoneNO"
                value={formData.phoneNO}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } ${errors.phoneNO ? "border-red-500" : ""}`}
                required
              />
              {errors.phoneNO && (
                <p className="text-red-500 text-sm">{errors.phoneNO}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-bold mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } ${errors.email ? "border-red-500" : ""}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="governorate" className="block font-bold mb-2">
                المحافظة
              </label>
              <input
                type="text"
                id="governorate"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } ${errors.governorate ? "border-red-500" : ""}`}
                required
              />
              {errors.governorate && (
                <p className="text-red-500 text-sm">{errors.governorate}</p>
              )}
            </div>
            {!isUser && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="specialization"
                    className="block font-bold mb-2"
                  >
                    الاختصاص
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800"
                    } ${errors.specialization ? "border-red-500" : ""}`}
                    required
                  >
                    <option value="">اختر الاختصاص</option>
                    <option value="الشاشات الالكترونية">
                      الشاشات الالكترونية
                    </option>
                    <option value="موبايل">موبايل</option>
                    <option value="لابتوب">لابتوب</option>
                  </select>
                  {errors.specialization && (
                    <p className="text-red-500 text-sm">
                      {errors.specialization}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="services" className="block font-bold mb-2">
                    وصف الخدمة
                  </label>
                  <textarea
                    id="services"
                    name="services"
                    value={formData.services}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800"
                    } ${errors.services ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.services && (
                    <p className="text-red-500 text-sm">{errors.services}</p>
                  )}
                </div>
              </>
            )}
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="address" className="block font-bold mb-2">
                العنوان
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } ${errors.address ? "border-red-500" : ""}`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-bold mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } ${errors.password ? "border-red-500" : ""}`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block font-bold mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } ${errors.confirmPassword ? "border-red-500" : ""}`}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="p-4">{renderStepContent()}</div>

      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-300 rounded flex items-center"
          >
            <AiOutlineArrowLeft className="mr-2" />
            السابق
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
          >
            التالي
            <AiOutlineArrowRight className="ml-2" />
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {isNew ? "إنشاء" : "حفظ"}
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
