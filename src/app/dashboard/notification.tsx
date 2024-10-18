// src/app/dashboard/notification.tsx

import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "@/app/ThemeContext";
import Modal from "react-modal";

// الواجهات كما هي
interface APINotification {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  senderId: number;
  isRead: boolean;
  requestId: number;
  recipientId: number;
}

interface MappedNotification {
  id: number;
  title: string;
  content: string;
  createdAt: string;
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

  // حالة فتح/إغلاق المودال
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );

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

      console.log("Response:", response.data);

      if (!Array.isArray(response.data)) {
        throw new Error("البيانات المستلمة ليست مصفوفة");
      }

      // قم بتحويل الإشعارات المستلمة إلى الشكل المطلوب
      const notificationsWithReadStatus = response.data.map(
        (notification: APINotification) => ({
          id: notification.id,
          title: notification.title,
          content: notification.content,
          createdAt: notification.createdAt,
          senderId: notification.senderId,
          isRead: notification.isRead,
          requestId: notification.requestId,
        })
      );

      // تحديث حالة الإشعارات
      setNotifications(notificationsWithReadStatus);
    } catch (err) {
      setError("فشل في جلب الإشعارات");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAcceptRequest = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true); // فتح المودال عند النقر على القبول
  };

  const handleRejectRequest = async (id: number, requestId: number) => {
    setLoadingAction(id);
    try {
      await axios.post(`${API_BASE_URL}/reject-request/${requestId}`);
      toast.success("تم رفض الطلب بنجاح.");
      fetchNotifications();
    } catch (error) {
      console.error("حدث خطأ أثناء رفض الطلب:", error);
      toast.error("حدث خطأ أثناء رفض الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingAction(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
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
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
      }`}
    >
      <h1 className="text-2xl text-center font-bold mb-6">الإشعارات</h1>
      {notifications.length === 0 ? (
        <div className="text-center">لا توجد إشعارات.</div>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`mb-4  p-4 border rounded-md  ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-yellow-500">
                  {notification.title}
                </h2>
                {!notification.isRead && (
                  <div className="h-2 w-2 bg-red-500 rounded-full ml-2"></div>
                )}
              </div>
              <p>{notification.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              {notification.title === "استلام الطلب" && ( // عرض الأزرار فقط إذا كان العنوان "استلام الطلب"
                <div className="mt-2 flex">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => handleAcceptRequest(notification.requestId)} // تمرير requestId
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
                      handleRejectRequest(
                        notification.id,
                        notification.requestId
                      )
                    }
                    disabled={loadingAction === notification.id}
                  >
                    {loadingAction === notification.id ? (
                      <ClipLoader color="#ffffff" size={20} />
                    ) : (
                      "رفض"
                    )}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* مودال الدفع */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className="modal-class"
        overlayClassName="modal-overlay"
      >
        <h2>إتمام عملية الدفع</h2>
        <p>طلب الدفع لـ ID: {selectedRequestId}</p>
        {/* هنا سيتم وضع مكون فورم الدفع لاحقاً */}
        <button onClick={closeModal}>إغلاق</button>
      </Modal>

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
