"use client";
import React, { useState, useContext } from "react";
import Navbar from "@/components/navBar";
import { toast } from "react-toastify";
import { ThemeContext } from "../ThemeContext";
import axios from "axios";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai"; // استيراد أيقونات السهم

const RegisterPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    governorate: "",
    password: "",
    confirmPassword: "",
    phoneNO: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNO: "",
    governorate: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // إعادة تعيين الخطأ عند الكتابة
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    // تأكيد ملء الحقول بناءً على الخطوة الحالية
    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب";
      if (!formData.email.includes("@"))
        newErrors.email = "البريد الإلكتروني غير صالح";
      if (!formData.phoneNO) newErrors.phoneNO = "رقم الهاتف مطلوب";
    } else if (currentStep === 2) {
      if (!formData.governorate) newErrors.governorate = "المحافظة مطلوبة";
      if (!formData.address) newErrors.address = "العنوان مطلوب";
    } else if (currentStep === 3) {
      if (formData.password.length < 8)
        newErrors.password = "كلمة المرور يجب أن تكون على الأقل 8 أحرف";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
      return;
    }

    try {
      const response = await axios.post(
        "https://evo-fix-api.vercel.app/api/users",
        {
          email: formData.email,
          fullName: formData.fullName,
          governorate: formData.governorate,
          password: formData.password,
          phoneNO: formData.phoneNO,
          address: formData.address,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم إنشاء الحساب بنجاح!");
        setFormData({
          fullName: "",
          email: "",
          governorate: "",
          password: "",
          confirmPassword: "",
          phoneNO: "",
          address: "",
        });
      } else {
        toast.error("حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`حدث خطأ: ${error.response.data.message || "غير معروف"}`);
      } else {
        toast.error("تعذر الاتصال بالخادم");
      }
    }
  };

  const nextStep = () => {
    if (validateForm()) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
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
                className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
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
              <label htmlFor="email" className="block font-bold mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
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
                className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
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
                className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
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
                className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
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
          </>
        );
      case 3:
        return (
          <>
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
                className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
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
                className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
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
    <>
      <Navbar />
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`p-8 rounded shadow-md w-full max-w-sm ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">تسجيل حساب جديد</h2>
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  <AiOutlineArrowRight className="ml-2" />
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <AiOutlineArrowLeft className="mr-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  التسجيل
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
