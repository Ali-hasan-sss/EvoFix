import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "@/app/context/ThemeContext";
import Modal from "react-modal";
import PaymentForm from "@/components/forms/PaymentForm";
import { useNotifications } from "../context/NotificationsContext"; // استخدام السياق الصحيح

interface APINotification {
  id: number;
  recipientId: number;
  senderId: number;
  requestId: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  request?: {
    isPaid: boolean;
    isPaidCheckFee: boolean;
  };
}

const NotificationComponent: React.FC = () => {
  const { notifications, loading, error } = useNotifications(); // استخدام السياق لجلب الإشعارات
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [isInspectionFee, setIsInspectionFee] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  // دالة لقبول الطلب وفتح نموذج الدفع
  const handleAcceptRequest = (requestId: number, inspectionFee: boolean) => {
    if (isModalOpen) {
      return;
    }
    setSelectedRequestId(requestId);
    setIsInspectionFee(inspectionFee);
    setIsModalOpen(true);
  };

  // دالة لرفض الطلب
  const handleRejectRequest = async (id: number, requestId: number) => {
    setLoadingAction(id);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";
      await axios.put(
        `/maintenance-requests/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("تم رفض الطلب بنجاح.");
      // يمكنك هنا تحديث الإشعارات حسب الحاجة
    } catch (error) {
      console.error("حدث خطأ أثناء رفض الطلب:", error);
      toast.error("حدث خطأ أثناء رفض الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingAction(null);
    }
  };

  // إغلاق المودال
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
  };

  // دالة عند الضغط على الإشعار لجعله "مقروء"
  const handleNotificationClick = async (notificationId: number) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    const authToken = token ? token.split("=")[1] : "";

    await axios.put(
      `/notifications/${notificationId}`,
      { isRead: true },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // تحديث حالة الإشعارات لتصبح مقروءة
    // هنا يمكنك تحديث حالة الإشعارات في السياق إذا لزم الأمر
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
              className={`mb-4 p-4 border rounded-md cursor-pointer ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
              onClick={() => handleNotificationClick(notification.id)}
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
              {notification.title === "دفع أجور الكشف" && (
                <div className="mt-2 flex">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() =>
                      handleAcceptRequest(notification.requestId, true)
                    }
                    disabled={
                      loadingAction === notification.id ||
                      notification.request?.isPaidCheckFee ||
                      notification.request?.isPaid ||
                      isModalOpen
                    }
                  >
                    {loadingAction === notification.id ? (
                      <ClipLoader color="#ffffff" size={20} />
                    ) : (
                      "دفع أجور الكشف"
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
                    disabled={
                      loadingAction === notification.id ||
                      notification.request?.isPaidCheckFee ||
                      notification.request?.isPaid
                    }
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className={`relative p-6 rounded-lg max-w-md mx-auto z-50 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        overlayClassName={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40`}
      >
        <button
          onClick={closeModal}
          className={`absolute top-2 left-2 ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          &#x2715;
        </button>

        <h2 className="text-center text-xl font-bold mb-4">
          إتمام عملية الدفع
        </h2>
        {selectedRequestId && (
          <PaymentForm
            requestId={selectedRequestId}
            closeModal={closeModal}
            isInspectionPayment={isInspectionFee}
          />
        )}
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
