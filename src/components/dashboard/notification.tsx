"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "@/app/context/ThemeContext";
import Modal from "react-modal";
import PaymentForm from "@/components/forms/PaymentForm";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { APINotification, MappedNotification } from "@/utils/types";

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<MappedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [loadingAction1, setLoadingAction1] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useContext(ThemeContext);
  const [isInspectionFee, setIsInspectionFee] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const router = useRouter();

  const FETCH_INTERVAL = 60000;

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  const fetchNotifications = async (showSpinner: boolean = false) => {
    if (showSpinner) setIsNotificationsLoading(true); // عرض السبينر فقط إذا تم التحديد
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //  console.log("Response from API:", response.data);

      const mappedNotifications = response.data.map(
        (notification: APINotification) => ({
          id: notification.id,
          title: notification.title,
          content: notification.content,
          createdAt: notification.createdAt,
          senderId: notification.senderId,
          isRead: notification.isRead,
          requestId: notification.requestId,
          isPaidCheckFee: notification.request
            ? notification.request.isPaidCheckFee
            : false,
          isPaid: notification.request ? notification.request.isPaid : false,
          rejected: notification.request?.status === "REJECTED" || false,
          status: notification.request?.status,
          recipientId: notification.recipientId,
          request: notification.request || null,
        })
      );

      //   console.log("Mapped Notifications:", mappedNotifications);

      setNotifications(mappedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications. Please try again later.");
    } finally {
      setIsNotificationsLoading(false);
      setIsFirstLoading(false); // بعد أول تحميل، قم بتعطيل حالة التحميل الأول
    }
  };

  useEffect(() => {
    // عند أول تحميل، قم بإظهار السبينر
    fetchNotifications(true);
    // استدعاء الدالة كل دقيقة بدون السبينر
    const intervalId = setInterval(
      () => fetchNotifications(false),
      FETCH_INTERVAL
    );
    return () => clearInterval(intervalId);
  }, []);

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
    setLoadingAction1(id);
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
      setLoadingAction1(null);
    }
  };

  const handleActivationToggle = async (notification: MappedNotification) => {
    try {
      // التوجيه إلى صفحة المستخدم بناءً على senderId
      router.push(`/users/${notification.senderId}`);
    } catch (error) {
      console.error("خطأ في التوجيه إلى صفحة المستخدم:", error);
      toast.error("حدث خطأ أثناء محاولة زيارة صفحة المستخدم");
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
  };

  if (isFirstLoading) {
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
    <div className={`p-4 mt-3 w-full `}>
      {notifications.length === 0 ? (
        <div className="text-center">لا توجد إشعارات.</div>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`mb-4 p-4  rounded-md cursor-pointer ${
                isDarkMode ? "dark-bg-1 shadow-dark" : "light-bg-1 shadow-light"
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
              {/************************************************************************************************* */}
              {notification.title === "دفع أجور الكشف" &&
                !notification.request?.isPaidCheckFee === true &&
                notification.request?.status !== "REJECTED" && (
                  <div className="mt-2 flex">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                      type="button"
                      onClick={() => {
                        handleAcceptRequest(notification.requestId, true);
                      }}
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
                      onClick={() => {
                        handleRejectRequest(
                          notification.id,
                          notification.requestId
                        );
                      }}
                      disabled={
                        loadingAction1 === notification.id ||
                        notification.request?.isPaidCheckFee ||
                        notification.request?.isPaid
                      }
                    >
                      {loadingAction1 === notification.id ? (
                        <ClipLoader color="#ffffff" size={20} />
                      ) : (
                        "رفض"
                      )}
                    </button>
                  </div>
                )}

              {notification.title === "إنجاز الطلب" &&
                !notification.request?.isPaid &&
                notification.request?.status !== "REJECTED" && (
                  <div className="mt-2 flex">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                      type="button"
                      onClick={() =>
                        handleBaiedRequest(notification.requestId, false)
                      }
                      disabled={
                        loadingAction === notification.id ||
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
                        loadingAction1 === notification.id ||
                        notification.request?.isPaidCheckFee ||
                        notification.request?.isPaid
                      }
                    >
                      {loadingAction1 === notification.id ? (
                        <ClipLoader color="#ffffff" size={20} />
                      ) : (
                        "رفض"
                      )}
                    </button>
                  </div>
                )}

              {notification.title === "تكلفة الطلب" &&
                notification.request?.status !== "IN_PROGRESS" &&
                notification.request?.status !== "COMPLETED" &&
                notification.request?.status !== "REJECTED" && (
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
                        loadingAction === notification.id ||
                        notification.request?.isPaid
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
                      disabled={loadingAction1 === notification.id}
                    >
                      {loadingAction1 === notification.id ? (
                        <ClipLoader color="#ffffff" size={20} />
                      ) : (
                        "رفض"
                      )}
                    </button>
                  </div>
                )}
              {notification.title === "طلب تفعيل حساب تقني" && (
                <div className="mt-2 flex items-center ">
                  <button
                    className="bg-blue-500 py-1 px-3 rounded hover:bg-blue-300"
                    onClick={() => handleActivationToggle(notification)}
                    disabled={isActivating}
                  >
                    <FaEye /> مشاهدة
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
            update={fetchNotifications}
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
