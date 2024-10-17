"use client";

import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/ThemeContext";

const RepairRequestButton: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // تأكد من استخدام نفس السياق
  const [governorate, setGovernorate] = useState("دمشق");
  const [phoneNO, setPhoneNO] = useState("0991742941");
  const [address, setAddress] = useState("مزة اوتستراد");
  const [deviceType, setDeviceType] = useState("غسالة");
  const [problemDescription, setProblemDescription] = useState(
    "هناك ارتجاج بالمحرك مع صوت"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode: themeMode } = useContext(ThemeContext);
  if (themeMode) {
    console.log("Dark mode is enabled");
  } else {
    console.log("Light mode is enabled");
  }
  useEffect(() => {
    console.log("Dark Mode Status:", isDarkMode); // تحقق من تحديث القيمة
  }, [isDarkMode]);

  const openModal = () => {
    setIsModalOpen(true);
    // console.log("Current Dark Mode:", isDarkMode);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = Cookies.get("token");

    const requestData = {
      governorate,
      phoneNO,
      address,
      deviceType,
      problemDescription,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/maintenance-requests`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        //  console.log("تم إرسال الطلب بنجاح");
        closeModal();
      } else {
        console.log("فشل في إرسال الطلب");
      }
    } catch (error) {
      console.error("حدث خطأ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Repair Request Button */}
      <button
        onClick={openModal}
        className="fixed bottom-20 left-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-20"
      >
        طلب إصلاح
      </button>

      {!isLoggedIn && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={` p-6 rounded-lg shadow-lg w-96 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-400 text-black"
            }`}
          >
            <button
              type="button"
              onClick={closeModal}
              className="text-light bg-red-500 px-2 block rounded hover:bg-red-400"
            >
              X
            </button>
            <div className="mt-2">
              يجب عليك
              <a
                href="/login"
                className="text-blue-600 hover:text-yellow-500 mr-1"
              >
                تسجيل الدخول
              </a>
              او
              <a
                href="/register"
                className="text-blue-600 hover:text-yellow-500 mr-1"
              >
                انشاء حساب
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {isLoggedIn && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
          <div
            className={` p-6 rounded-lg shadow-lg w-96 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-500 text-black"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 ">طلب إصلاح</h2>

            {/* Form Contents */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block ">المحافظة</label>
                <select
                  id="specialization"
                  name="specialization"
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
              <div className="mb-4">
                <label className="block">رقم الهاتف</label>
                <input
                  type="text"
                  name="phoneNO"
                  className="w-full px-4 py-2 border rounded-lg "
                  value={phoneNO}
                  onChange={(e) => setPhoneNO(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block ">العنوان</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-2 border rounded-lg "
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block ">نوع الجهاز</label>
                <select
                  id="specialization"
                  name="specialization"
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className={`w-full p-2 border-b focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  } `}
                  required
                >
                  <option value="">اختر نوع الجهاز</option>
                  <option value="شاشة تلفاز">شاشة تلفاز</option>
                  <option value="شاشة كمبيوتر">شاشة كمبيوتر</option>
                  <option value="موبايل">موبايل</option>
                  <option value="لابتوب">لابتوب</option>
                  <option value="اجهزة منزلية">اجهزة منزلية</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block ">وصف المشكلة</label>
                <textarea
                  name="problemDescription"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 dark:bg-gray-600 dark:text-gray-200"
                >
                  تراجع
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0014.244 5.713l-1.444-1.444A6 6 0 116 12h-2z"
                        ></path>
                      </svg>
                      إرسال
                    </div>
                  ) : (
                    "إرسال"
                  )}
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
