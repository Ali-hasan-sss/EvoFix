"use client";

import React, { useState, useContext } from "react";
import { ThemeContext } from "@/app/ThemeContext";
import { toast } from "react-toastify";

interface FormData {
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

interface UserFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  submitButtonLabel?: string;
  isNew?: boolean;
  isUser?: boolean;
  isTechnical?: boolean;
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
    services: "",
  },
  onSubmit,
  submitButtonLabel = "التسجيل",
  isNew = true,
  isUser = true,
  isTechnical = false,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
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
    services: "",
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
    let isValid = true;

    if (!formData.fullName) {
      newErrors.fullName = "اسم المستخدم مطلوب";
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      isValid = false;
    }
    if (!formData.phoneNO) {
      newErrors.phoneNO = "رقم الهاتف مطلوب";
      isValid = false;
    }
    if (!formData.governorate) {
      newErrors.governorate = "المحافظة مطلوبة";
      isValid = false;
    }
    if (!formData.address) {
      newErrors.address = "العنوان مطلوب";
      isValid = false;
    }
    if (!isNew && !formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="mb-4">
        <label className="block mb-1">اسم المستخدم</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.fullName && (
          <span className="text-red-500 text-sm">{errors.fullName}</span>
        )}
      </div>
      {/* باقي حقول النموذج بنفس الطريقة */}
      <div className="mb-4">
        <label className="block mb-1">البريد الإلكتروني</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-1">رقم الهاتف</label>
        <input
          type="text"
          name="phoneNO"
          value={formData.phoneNO}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.phoneNO && (
          <span className="text-red-500 text-sm">{errors.phoneNO}</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-1">المحافظة</label>
        <input
          type="text"
          name="governorate"
          value={formData.governorate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.governorate && (
          <span className="text-red-500 text-sm">{errors.governorate}</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-1">العنوان</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.address && (
          <span className="text-red-500 text-sm">{errors.address}</span>
        )}
      </div>
      {!isNew && (
        <>
          <div className="mb-4">
            <label className="block mb-1">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">تأكيد كلمة المرور</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </>
      )}
      {isTechnical && (
        <div className="mb-4">
          <label className="block mb-1">التخصص</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.specialization && (
            <span className="text-red-500 text-sm">
              {errors.specialization}
            </span>
          )}
        </div>
      )}
      {isTechnical && (
        <div className="mb-4">
          <label className="block mb-1">وصف الخدمات</label>
          <textarea
            name="services"
            value={formData.services || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.services && (
            <span className="text-red-500 text-sm">{errors.services}</span>
          )}
        </div>
      )}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        {submitButtonLabel}
      </button>
    </form>
  );
};

export default UserForm;
