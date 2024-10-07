"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios"; // استيراد Axios
import { API_BASE_URL } from "../../utils/api"; // تأكد من استيراد API_BASE_URL بشكل صحيح
import { ThemeContext } from "../ThemeContext"; // تأكد من استيراد ThemeContext

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
}

const Notifications: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext); // استخدام السياق لتحديد وضع السمة
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة لجلب الإشعارات
  const fetchNotifications = async () => {
    try {
      // جلب التوكن من الكوكيز
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // إضافة التوكن في الهيدر
        },
      });

      // تعيين البيانات المستلمة
      setNotifications(response.data);
    } catch (err) {
      // التعامل مع الأخطاء
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "فشل في جلب الإشعارات");
      } else {
        setError("حدث خطأ غير معروف");
      }
    } finally {
      setLoading(false);
    }
  };

  // استخدام useEffect لجلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchNotifications();
  }, []);

  // عرض التحميل أو الخطأ
  if (loading) {
    return <div>جاري جلب الإشعارات...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // عرض الإشعارات
  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">الإشعارات</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li key={notification.id} className="border p-4 rounded-md shadow">
            <h3 className="font-semibold">{notification.title}</h3>
            <p>{notification.content}</p>
            <span className="text-gray-500 text-sm">{notification.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
