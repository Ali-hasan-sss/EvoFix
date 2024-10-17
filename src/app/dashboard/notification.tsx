// src/app/dashboard/notification.tsx

"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "@/app/ThemeContext";

// تعريف الواجهة الأصلية للإشعار كما تستلمه من الخادم
interface APINotification {
  id: number;
  title: string;
  content: string;
  createdAt: string; // أو Date حسب الحاجة
  senderId: number;
  isRead: boolean;
  metadata: {
    requestId: number;
  };
}

// تعريف الواجهة بعد إضافة requestId كخاصية على المستوى الأعلى
interface MappedNotification {
  id: number;
  title: string;
  content: string;
  createdAt: string; // أو Date حسب الحاجة
  senderId: number;
  isRead: boolean;
  requestId: number;
}

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<MappedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isDarkMode } = useContext(ThemeContext);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // طباعة الاستجابة
      console.log("Response:", response.data);

      // تحقق من هيكل البيانات
      if (!Array.isArray(response.data)) {
        throw new Error("البيانات المستلمة ليست مصفوفة");
      }

      const notificationsWithReadStatus: MappedNotification[] = response.data
        .map((notification: APINotification) => ({
          id: notification.id,
          title: notification.title,
          content: notification.content,
          createdAt: notification.createdAt,
          senderId: notification.senderId,
          isRead: notification.isRead,
          requestId: notification.metadata?.requestId || 0, // استخدام 0 كقيمة افتراضية
        }))
        .sort(
          (a: MappedNotification, b: MappedNotification) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setNotifications(notificationsWithReadStatus);
    } catch (err) {
      setError("فشل في جلب الإشعارات");
      console.error("Error fetching notifications:", err); // طباعة الخطأ بشكل أوضح
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAcceptRequest = async (id: number, requestId: number) => {
    setLoadingAction(id);
    // تنفيذ عملية القبول هنا
    // على سبيل المثال:
    try {
      await axios.post(`${API_BASE_URL}/accept-request/${requestId}`);
      toast.success("تم قبول الطلب بنجاح.");
      // تحديث حالة الإشعارات أو إعادة جلبها
      fetchNotifications();
    } catch (error) {
      console.error("حدث خطأ أثناء قبول الطلب:", error);
      toast.error("حدث خطأ أثناء قبول الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectRequest = async (id: number, requestId: number) => {
    setLoadingAction(id);
    // تنفيذ عملية الرفض هنا
    // على سبيل المثال:
    try {
      await axios.post(`${API_BASE_URL}/reject-request/${requestId}`);
      toast.success("تم رفض الطلب بنجاح.");
      // تحديث حالة الإشعارات أو إعادة جلبها
      fetchNotifications();
    } catch (error) {
      console.error("حدث خطأ أثناء رفض الطلب:", error);
      toast.error("حدث خطأ أثناء رفض الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">الإشعارات</h1>
      {notifications.length === 0 ? (
        <div className="text-center">لا توجد إشعارات.</div>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="mb-4 p-4 border rounded-md">
              <h2 className="text-xl font-semibold">{notification.title}</h2>
              <p>{notification.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              <div className="mt-2 flex">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() =>
                    handleAcceptRequest(notification.id, notification.requestId)
                  } // تمرير requestId
                  disabled={loadingAction === notification.id}
                >
                  {loadingAction === notification.id ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "قبول"
                  )}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() =>
                    handleRejectRequest(notification.id, notification.requestId)
                  } // تمرير requestId
                  disabled={loadingAction === notification.id}
                >
                  {loadingAction === notification.id ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "رفض"
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* إضافة ToastContainer لعرض الإشعارات */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default NotificationComponent;
