"use client";

import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/ThemeContext";
import Image from "next/image";
import toast from "react-hot-toast"; // تأكد من تثبيت react-hot-toast

const RepairRequestButton: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [governorate, setGovernorate] = useState("");
  const [phoneNO, setPhoneNO] = useState("");
  const [address, setAddress] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
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
        toast.success("تم إرسال الطلب بنجاح!"); // رسالة توست عند الإرسال الناجح
        // إعادة تعيين النموذج
        setGovernorate("دمشق");
        setPhoneNO("0991742941");
        setAddress("مزة اوتستراد");
        setDeviceType("غسالة");
        setDeviceModel("");
        setProblemDescription("هناك ارتجاج بالمحرك مع صوت");
        removeImage(); // إزالة الصورة
        closeModal(); // إغلاق النافذة
      } else {
        console.log("فشل في إرسال الطلب");
      }
    } catch (error) {
      console.error("حدث خطأ:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب"); // رسالة توست عند حدوث خطأ
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-20 left-5 bg-blue-400 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-20"
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
                </select>
              </div>

              <div className="mb-4">
                <label className="block">رقم الهاتف</label>
                <input
                  type="text"
                  value={phoneNO}
                  onChange={(e) => setPhoneNO(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg text-black${
                    isDarkMode
                      ? "bg-gray-800 text-black"
                      : "bg-gray-200 text-black"
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
                  className="w-full text-black px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block">نوع الجهاز</label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className={`w-full p-2 border-b focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  required
                >
                  <option value="">اختر نوع الجهاز</option>
                  <option value="شاشات">شاشات الكترونية</option>
                  <option value="كمبيوتر">جهاز كمبيوتر</option>
                  <option value="موبايل">موبايل</option>
                  <option value="لابتوب">لابتوب</option>
                </select>
              </div>

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
                  <option value="LG">LG</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Haier">Haier</option>
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
                  className="w-full text-black px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                >
                  تراجع
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span className="mr-2 spinner-border animate-spin"></span>
                  )}
                  {isLoading ? "إرسال..." : "إرسال"}
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
