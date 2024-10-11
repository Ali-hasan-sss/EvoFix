"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ThemeContext } from "../ThemeContext";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

interface Notification {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  senderId: number;
  isRead: boolean;
  requestId: string; // أضف requestId هنا
}

const Notifications: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const fetchNotifications = async () => {
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
      console.log("Response:", response);

      const notificationsWithReadStatus = response.data
        .map((notification: any) => ({
          id: notification.id,
          title: notification.title,
          content: notification.content,
          createdAt: notification.createdAt,
          senderId: notification.senderId,
          isRead: notification.isRead,
          requestId: notification.metadata.requestId, // استخراج requestId من metadata
        }))
        .sort(
          (a: Notification, b: Notification) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setNotifications(notificationsWithReadStatus);
    } catch (err) {
      setError("فشل في جلب الإشعارات");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (
    notificationId: number,
    requestId: string
  ) => {
    setLoadingAction(notificationId);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      await axios.put(
        `${API_BASE_URL}/maintenance-requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // تحديث الإشعارات بعد قبول الطلب
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      toast.success("تم قبول الطلب بنجاح.");
    } catch (error) {
      console.error("فشل في قبول الطلب:", error);
      toast.error("فشل في قبول الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectRequest = async (
    notificationId: number,
    requestId: string
  ) => {
    // تحقق من أن requestId ليس undefined
    if (!requestId) {
      console.error("requestId is undefined");
      toast.error("المعرف غير صالح.");
      return;
    }

    setLoadingAction(notificationId);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      await axios.put(
        `${API_BASE_URL}/maintenance-requests/${requestId}/reorder`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // تحديث الإشعارات بعد رفض الطلب
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      toast.success("تم رفض الطلب بنجاح.");
    } catch (error) {
      console.error("فشل في رفض الطلب:", error);
      toast.error("فشل في رفض الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      className={`relative p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">الإشعارات</h2>

      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li key={notification.id} className="border p-4 rounded-md shadow">
            <div className="flex items-center justify-between">
              {!notification.isRead && (
                <div className="h-2 w-2 bg-red-500 rounded-full ml-2"></div>
              )}
              <h3 className="font-semibold">{notification.title}</h3>
            </div>
            <p>{notification.content}</p>
            <span className="text-gray-500 text-sm">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            <div className="flex justify-end mt-2">
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

export default Notifications;
