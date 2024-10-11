"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ThemeContext } from "../ThemeContext";
import Switch from "react-switch";
import { confirmAlert } from "react-confirm-alert";
import { ClipLoader } from "react-spinners";
import "react-confirm-alert/src/react-confirm-alert.css"; // استيراد أنماط react-confirm-alert
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  senderId: number; // تم تغيير userId إلى senderId
  isRead: boolean;
  content: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  role: string;
  isActive: boolean;
  address: string;
}

const Notifications: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [loadingUser, setLoadingUser] = useState(false); // حالة تحميل بيانات المستخدم
  const [loadingMarkAsRead, setLoadingMarkAsRead] = useState<number | null>(
    null
  ); // حالة تحميل عند تغيير حالة القراءة

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

      // لا تقم بتجاوز isRead، استخدم القيمة الموجودة في الاستجابة
      const notificationsWithReadStatus = response.data.sort(
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

  const fetchUserData = async (userId: number) => {
    try {
      setLoadingUser(true); // تفعيل حالة التحميل
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setSelectedUser(response.data);
      setShowUserDetails(true);
    } catch (err) {
      console.error("فشل في جلب بيانات المستخدم:", err);
      toast.error("فشل في جلب بيانات المستخدم. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingUser(false); // إيقاف حالة التحميل
    }
  };

  const handleToggleActive = (userId: number, currentStatus: boolean) => {
    confirmAlert({
      title: "تأكيد التغيير",
      message: `هل أنت متأكد من أنك تريد ${
        currentStatus ? "تعطيل" : "تفعيل"
      } حساب هذا المستخدم؟`,
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setTogglingUserId(userId);
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
              const authToken = token ? token.split("=")[1] : "";

              await axios.put(
                `${API_BASE_URL}/users/${userId}`,
                { isActive: !currentStatus },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );

              setSelectedUser((prevUser) =>
                prevUser ? { ...prevUser, isActive: !currentStatus } : prevUser
              );

              // تحديث حالة المستخدم في قائمة الإشعارات إذا موجود
              setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                  notification.senderId === userId
                    ? { ...notification }
                    : notification
                )
              );

              toast.success(
                `تم ${!currentStatus ? "تفعيل" : "تعطيل"} الحساب بنجاح.`
              );
            } catch (error) {
              console.error("فشل في تحديث الحالة:", error);
              toast.error("فشل في تحديث الحالة. يرجى المحاولة مرة أخرى.");
            } finally {
              setTogglingUserId(null);
            }
          },
        },
        {
          label: "لا",
          onClick: () => {},
        },
      ],
    });
  };

  const markAsRead = async (notificationId: number) => {
    setLoadingMarkAsRead(notificationId);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}`,
        { isRead: true },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      toast.success("تم تعيين الإشعار كمقروء بنجاح.");
    } catch (error) {
      console.error("فشل في تغيير حالة الإشعار:", error);
      toast.error("فشل في تغيير حالة الإشعار. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingMarkAsRead(null);
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

  const handleNotificationClick = (senderId: number) => {
    fetchUserData(senderId);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const getRoleInArabic = (role: string) => {
    switch (role) {
      case "user":
        return "مستخدم";
      case "admin":
        return "مسؤول عام";
      case "subAdmin":
        return "مسؤول فرعي";
      case "technician":
        return "تقني";
      default:
        return role;
    }
  };

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
                <div
                  className="h-2

 w-2 bg-red-500 rounded-full ml-2"
                ></div>
              )}
              <h3 className="font-semibold">{notification.title}</h3>
            </div>
            <p>{notification.content}</p>
            <span className="text-gray-500 text-sm">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            <div className="flex justify-end mt-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => handleNotificationClick(notification.senderId)}
                disabled={loadingUser}
              >
                {loadingUser ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  "عرض التفاصيل"
                )}
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={() => markAsRead(notification.id)}
                disabled={loadingMarkAsRead === notification.id}
              >
                {loadingMarkAsRead === notification.id ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  "تعيين كمقروء"
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showUserDetails && selectedUser && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${
            isDarkMode ? "dark" : ""
          }`}
        >
          <div
            className={`relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-y-auto ${
              isDarkMode ? "border border-gray-700" : "border border-gray-200"
            }`}
            style={{ maxHeight: "90vh" }}
          >
            {loadingUser ? (
              <div className="flex justify-center items-center h-96">
                <ClipLoader color="#4A90E2" size={50} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">تفاصيل المستخدم</h3>
                  <button
                    onClick={handleCloseUserDetails}
                    className="text-whaite font-semibold fixed bg-red-500 p-1 px-2 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p>
                      <strong>الاسم:</strong> {selectedUser.fullName}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p>
                      <strong>البريد الإلكتروني:</strong> {selectedUser.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p>
                      <strong>الموبايل:</strong> {selectedUser.phoneNO}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p>
                      <strong>المحافظة:</strong> {selectedUser.governorate}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p>
                      <strong>العنوان:</strong> {selectedUser.address}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p>
                      <strong>نوع الحساب:</strong>{" "}
                      {getRoleInArabic(selectedUser.role)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p>
                      <strong>الحالة:</strong>{" "}
                      {selectedUser.isActive ? "مفعل" : "غير مفعل"}
                    </p>
                    <div className="flex justify-center mt-4">
                      <Switch
                        onChange={() =>
                          handleToggleActive(
                            selectedUser.id,
                            selectedUser.isActive
                          )
                        }
                        checked={selectedUser.isActive}
                        onColor="#4A90E2"
                        offColor="#ccc"
                        disabled={togglingUserId === selectedUser.id}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
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

export default Notifications;
