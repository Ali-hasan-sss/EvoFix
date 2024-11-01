import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "@/app/context/ThemeContext";
import Modal from "react-modal";
import PaymentForm from "@/components/forms/PaymentForm";
import Switch from "react-switch";

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

interface MappedNotification extends APINotification {
  isPaidCheckFee: boolean;
  isPaid: boolean;
}

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<MappedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useContext(ThemeContext);
  const [isInspectionFee, setIsInspectionFee] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [isActivating, setIsActivating] = useState(false);

  const FETCH_INTERVAL = 60000;

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

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

      if (!Array.isArray(response.data)) {
        throw new Error("البيانات المستلمة ليست مصفوفة");
      }

      const notificationsWithReadStatus = response.data.map(
        (notification: APINotification) => {
          console.log("Notification Request:", notification.request); // تحقق من القيم
          return {
            id: notification.id,
            title: notification.title,
            content: notification.content,
            createdAt: notification.createdAt,
            senderId: notification.senderId,
            isRead: notification.isRead,
            requestId: notification.requestId,
            isPaidCheckFee: notification.request?.isPaidCheckFee ?? true,
            isPaid: notification.request?.isPaid ?? false,
            recipientId: notification.recipientId,
          };
        }
      );

      console.log("Mapped notifications:", notificationsWithReadStatus);
      setNotifications(notificationsWithReadStatus);
    } catch (err) {
      setError("فشل في جلب الإشعارات");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // استدعاء الدالة تلقائيًا كل 10 دقائق باستخدام useEffect
  useEffect(() => {
    fetchNotifications(); // استدعاء أولي عند تحميل المكون

    const intervalId = setInterval(fetchNotifications, FETCH_INTERVAL);

    return () => clearInterval(intervalId); // تنظيف عند إزالة المكون
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAcceptRequest = (requestId: number, inspectionFee: boolean) => {
    if (isModalOpen) {
      console.warn(inspectionFee);
      return;
    }
    setSelectedRequestId(requestId);
    setIsInspectionFee(true);
    setIsModalOpen(true);
  };
  const handleBaiedRequest = (requestId: number, inspectionFee: boolean) => {
    if (isModalOpen) {
      console.warn(inspectionFee);
      return;
    }
    setSelectedRequestId(requestId);
    setIsInspectionFee(false);
    setIsModalOpen(true);
  };

  const handleRejectRequest = async (id: number, requestId: number) => {
    setLoadingAction(id);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";
      await axios.put(
        `${API_BASE_URL}/maintenance-requests/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("تم رفض الطلب بنجاح.");
      fetchNotifications();
    } catch (error) {
      console.error("حدث خطأ أثناء رفض الطلب:", error);
      toast.error("حدث خطأ أثناء رفض الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleActivationToggle = async (
    checked: boolean,
    notification: MappedNotification
  ) => {
    setIsActivating(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    const authToken = token ? token.split("=")[1] : "";
    try {
      await axios.put(
        `${API_BASE_URL}/users/${notification.senderId}`,
        {
          isActive: checked,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success(
        checked ? "تم تفعيل حساب التقني بنجاح" : "تم تعطيل حساب التقني بنجاح"
      );
    } catch (error) {
      console.error("خطأ في تفعيل الحساب:", error);
      toast.error("حدث خطأ أثناء تحديث حالة حساب التقني");
    } finally {
      setIsActivating(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
  };

  const handleNotificationClick = async (notificationId: number) => {
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
      className={`p-4 mt-3 w-full ${
        isDarkMode ? "bg-gray-700 text-white" : "bg-gray-400 text-black"
      }`}
    >
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
                    type="button"
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
                    className="bg-red-500 text-white px-4 mx-4 py-2 rounded-md"
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
              {notification.title === "إنجاز الطلب" && (
                <div className="mt-2 flex">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    type="button"
                    onClick={() =>
                      handleBaiedRequest(notification.requestId, false)
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
                      "دفع رسوم الطلب"
                    )}
                  </button>

                  <button
                    className="bg-red-500 text-white px-4 mx-4 py-2 rounded-md"
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

              {notification.title === "تكلفة الطلب" && (
                <div className="mt-2 flex">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={async () => {
                      setLoadingAction(notification.id);
                      try {
                        const token = document.cookie
                          .split("; ")
                          .find((row) => row.startsWith("token="));
                        const authToken = token ? token.split("=")[1] : "";

                        await axios.put(
                          `${API_BASE_URL}/maintenance-requests/${notification.requestId}/accept`,
                          {},
                          {
                            headers: {
                              Authorization: `Bearer ${authToken}`,
                            },
                          }
                        );
                        toast.success("تمت الموافقة على السعر بنجاح.");
                        fetchNotifications();
                      } catch (error) {
                        console.error(
                          "حدث خطأ أثناء الموافقة على السعر:",
                          error
                        );
                        toast.error(
                          "حدث خطأ أثناء الموافقة على السعر. يرجى المحاولة مرة أخرى."
                        );
                      } finally {
                        setLoadingAction(null);
                      }
                    }}
                    disabled={
                      loadingAction === notification.id || notification.isPaid
                    }
                  >
                    {loadingAction === notification.id ? (
                      <ClipLoader color="#ffffff" size={20} />
                    ) : (
                      "موافق"
                    )}
                  </button>

                  <button
                    className="bg-red-500 text-white px-4 mx-4 py-2 rounded-md"
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
              {notification.title === "طلب تفعيل حساب تقني" && (
                <div className="mt-2 flex items-center">
                  <label htmlFor="activate-switch" className="mr-2">
                    تفعيل الحساب
                  </label>
                  <Switch
                    id="activate-switch"
                    onChange={() => handleActivationToggle(true, notification)}
                    checked={isActivating}
                    disabled={isActivating}
                    width={40}
                    height={20}
                    onColor="#86d3ff"
                    offColor="#ccc"
                  />
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
        overlayClassName={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40`} // زيادة z-index للطبقة الخلفية
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
