"use client";

import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeContext } from "@/app/context/ThemeContext";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { UserFormInput } from "../../utils/types";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

// تعريف نوع props

interface UserFormProps {
  initialData?: UserFormInput;
  onSubmit: (data: UserFormInput) => Promise<void>;
  submitButtonLabel?: string;
  isNew?: boolean;
  isUser?: boolean;
  isTechnical?: boolean;
  isSubAdmin?: boolean;
  onClose?: () => void;
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
  admin_governorate?: string;
}
interface Service {
  title: string;
}

type EditUserFormInput = Omit<UserFormInput, "password" | "confirmPassword">;

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
    admin_governorate: "",
  },
  onSubmit,
  submitButtonLabel = "التسجيل",
  isTechnical,
  isSubAdmin,
  isNew,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentStep, setCurrentStep] = useState(1);

  // تحديد النوع المناسب للـ formData بناءً على قيمة isNew
  const [formData, setFormData] = useState<UserFormInput | EditUserFormInput>(
    isNew
      ? initialData
      : { ...initialData, password: undefined, confirmPassword: undefined }
  );

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
    admin_governorate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordR, setShowPasswordR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>([]);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
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
      admin_governorate: "",
    };

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب";
      if (!formData.email.includes("@"))
        newErrors.email = "البريد الإلكتروني غير صالح";
      if (!formData.phoneNO) newErrors.phoneNO = "رقم الهاتف مطلوب";
    } else if (currentStep === 2) {
      if (!formData.governorate) newErrors.governorate = "المحافظة مطلوبة";
      if (!formData.address || formData.address.length < 10)
        newErrors.address = "العنوان يجب أن يتجاوز 10 أحرف";
      if (isTechnical) {
        if (!formData.specialization)
          newErrors.specialization = "الاختصاص مطلوب";
        if (!formData.services) newErrors.services = "وصف الخدمة مطلوب";
      }
      if (isSubAdmin) {
        if (!formData.admin_governorate)
          newErrors.admin_governorate = "حدد محافظة العمل";
      }
    } else if (currentStep === 3 && isNew) {
      const { password, confirmPassword } = formData as UserFormInput;

      if (!password || !confirmPassword) {
        newErrors.password = password ? "" : "الرجاء إدخال كلمة المرور";
        newErrors.confirmPassword = confirmPassword
          ? ""
          : "الرجاء تأكيد كلمة المرور";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "كلمتا المرور غير متطابقتان";
      }
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
    setIsLoading(true);

    if (validateForm()) {
      // إنشاء بيانات النموذج حسب حالة `isNew`
      const filteredFormData = isNew
        ? formData // عند الإنشاء، نستخدم النموذج الكامل
        : ({
            ...formData,
            password: undefined,
            confirmPassword: undefined,
          } as Partial<UserFormInput>); // استخدام Partial لإزالة الحاجة لحقول كلمة المرور عند التعديل

      try {
        await onSubmit(filteredFormData as UserFormInput);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
                className={`w-full p-2 border-b focus:outline-none rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
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
                className={`w-full p-2 border-b focus:outline-none rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
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
                className={`w-full p-2 border-b focus:outline-none rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                } ${errors.email ? "border-red-500" : ""}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            {isNew && (
              <p className="m-2">
                <a className="text-blue-200 p-1" href="login">
                  لدي حساب بالفعل
                </a>
              </p>
            )}
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="governorate" className="block font-bold mb-2">
                المحافظة
              </label>
              <select
                id="governorate"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className={`w-full p-2 border-b focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                } ${errors.governorate ? "border-red-500" : ""}`}
                required
              >
                <option value="">اختر المحافظة</option>
                <option value="دمشق">دمشق</option>
                <option value="ريف دمشق">ريف دمشق</option>
                <option value="ريف دمشق">درعا</option>
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
                className={`w-full p-2 border-b focus:outline-none rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                } ${errors.fullName ? "border-red-500" : ""}`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            {isTechnical && (
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
                    className={`w-full p-2 border-b focus:outline-none ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    } ${errors.specialization ? "border-red-500" : ""}`}
                    required
                  >
                    <option value="">اختر الاختصاص</option>
                    {specializations.map((specialization, index) => (
                      <option key={index} value={specialization}>
                        {specialization}
                      </option>
                    ))}
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
                    className={`w-full p-2 border-b focus:outline-none ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
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
            {isNew && (
              <>
                <div className="mb-4">
                  <label htmlFor="password" className="block font-bold mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={
                        isNew ? (formData as UserFormInput).password || "" : ""
                      }
                      onChange={handleChange}
                      className={`w-full p-2 border-b focus:outline-none rounded ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      } ${errors.password ? "border-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block font-bold mb-2"
                  >
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordR ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={
                        isNew
                          ? (formData as UserFormInput).confirmPassword || ""
                          : ""
                      }
                      onChange={handleChange}
                      className={`w-full p-2 border-b focus:outline-none rounded ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      } ${errors.confirmPassword ? "border-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordR(!showPasswordR)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswordR ? (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {isNew && (
              <div className="flex items-center w-full mt-4">
                <input
                  type="checkbox"
                  className="ml-2"
                  id="x"
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="x">
                  اوافق علي سياسة الخصوصية و
                  <a
                    href="/privacy-and-terms"
                    className="text-blue-900 hover:text-blue-500 m-0 p-0"
                  >
                    شروط الاستخدام
                  </a>
                </label>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
      <div>{renderStepContent()}</div>

      <div className="flex justify-between mt-4">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className={`px-4 py-2 bg-gray-300 rounded flex items-center ${
              isDarkMode ? "text-white bg-gray-500" : "text-black"
            }`}
          >
            <AiOutlineArrowRight className="ml-2" />
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className={`px-4 py-2 bg-blue-500 text-white rounded flex items-center ${
              isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-600"
            }`}
          >
            <AiOutlineArrowLeft className="mr-2" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={
              (isNew && (isLoading || !isChecked)) || (!isNew && isLoading)
            }
            className={`btn-submit w-full mr-3
          ${
            (isLoading && isNew) || (!isChecked && isNew)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          >
            {submitButtonLabel}
            {isLoading && " ..."}
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
