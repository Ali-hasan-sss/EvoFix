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
    // console.log("Dark mode is enabled");
  } else {
    //   console.log("Light mode is enabled");
  }
  useEffect(() => {
    // console.log("Dark Mode Status:", isDarkMode); // تحقق من تحديث القيمة
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
        className="fixed bottom-20 left-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-50"
      >
        طلب إصلاح
      </button>

      {!isLoggedIn && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
            }`}
          >
            <button
              type="button"
              onClick={closeModal}
              className="text-light bg-red-500 p-2 block rounded hover:bg-red-400"
            >
              X
            </button>
            <div className="mt-2">
              يجب عليك
              <a href="/login" className="text-yellow-600 mr-1">
                تسجيل الدخول
              </a>
              او
              <a href="/register" className="text-yellow-600 mr-1">
                انشاء حساب
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {isLoggedIn && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              طلب إصلاح
            </h2>

            {/* Form Contents */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  المحافظة
                </label>
                <input
                  type="text"
                  name="governorate"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  name="phoneNO"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={phoneNO}
                  onChange={(e) => setPhoneNO(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  العنوان
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  نوع الجهاز
                </label>
                <input
                  type="text"
                  name="deviceType"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  وصف المشكلة
                </label>
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
