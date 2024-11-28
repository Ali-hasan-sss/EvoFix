"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import {
  RepairRequest,
  APINotification,
  FAQ,
  ContactMessage,
  Review,
  DeviceModel as device,
  // تأكد من إضافة النوع الخاص بالتقييمات
} from "@/utils/types"; // تأكد من إضافة الأنواع الجديدة

import toast from "react-hot-toast";
interface DeviceModel {
  id: number;
  serviceID: number | null;
  title: string;
  isActive: boolean;
  createAt: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  serviceImage: string;
  isActive: boolean;
  createAt: string;
  DevicesModels: DeviceModel[];
}
interface RepairRequestsContextProps {
  repairRequests: RepairRequest[];
  notifications: APINotification[];
  faqs: FAQ[];
  contactMessages: ContactMessage[];
  reviews: Review[];
  services: Service[];
  deviceModels: device[];
  fetchRepairRequests: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchFAQs: () => Promise<void>;
  fetchContactMessages: () => Promise<void>;
  fetchReviews: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchDeviceModels: () => Promise<void>;
  isLoading: boolean;
  isNotificationsLoading: boolean;
  isFAQsLoading: boolean;
  isContactMessagesLoading: boolean;
  isReviewsLoading: boolean;
  isServicesLoading: boolean;
  isDeviceLoading: boolean;
}

const RepairRequestsContext = createContext<
  RepairRequestsContextProps | undefined
>(undefined);

export const RepairRequestsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [notifications, setNotifications] = useState<APINotification[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [deviceModels, setfetchDeviceModels] = useState<device[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isNotificationsLoaded, setIsNotificationsLoaded] = useState(false);
  const [isFAQsLoaded, setIsFAQsLoaded] = useState(false);
  const [isContactMessagesLoaded, setIsContactMessagesLoaded] = useState(false);
  const [isReviewsLoaded, setIsReviewsLoaded] = useState(false);
  const [isServicesLoaded, setIsServicesLoaded] = useState(false);
  const [isDeviceLoaded, setIsDeviceLoaded] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [isFAQsLoading, setIsFAQsLoading] = useState(false);
  const [isContactMessagesLoading, setIsContactMessagesLoading] =
    useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isDeviceLoading, setIsDeviceLoading] = useState(false);

  // دالة جلب طلبات الإصلاح
  const fetchRepairRequests = async () => {
    if (repairRequests.length > 0) return;
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${API_BASE_URL}/maintenance-requests/all/admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRepairRequests(response.data || []);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching repair requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة جلب الإشعارات
  const fetchNotifications = async () => {
    if (isNotificationsLoaded) return;
    setIsNotificationsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notificationsWithReadStatus = response.data.map(
        (notification: APINotification) => {
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

      setNotifications(notificationsWithReadStatus);
      setIsNotificationsLoaded(true);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  // دالة جلب الأسئلة الشائعة
  const fetchFAQs = async () => {
    // if (isFAQsLoaded) return;
    setIsFAQsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/fAQ`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(response.data.faqs);
      setIsFAQsLoaded(true);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setIsFAQsLoading(false);
    }
  };

  // دالة جلب الرسائل
  const fetchContactMessages = async () => {
    // if (isContactMessagesLoaded) return;
    setIsContactMessagesLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/contact-us`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContactMessages(response.data.adminContactUs);
      setIsContactMessagesLoaded(true);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      setIsContactMessagesLoading(false);
    }
  };

  // دالة جلب التقييمات
  const fetchReviews = async () => {
    if (isReviewsLoaded) return;
    setIsReviewsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/review`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data.adminReviews || []);
      setIsReviewsLoaded(true);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  // Function to fetch services
  const fetchServices = useCallback(async () => {
    if (isServicesLoaded) return;
    setIsServicesLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data.services || []);
      setIsServicesLoaded(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
          ? (axiosError.response.data as { message: string }).message
          : "حدث خطأ أثناء جلب الخدمات.";
      console.error(errorMessage);
    } finally {
      setIsServicesLoading(false);
    }
  }, [isServicesLoaded]);

  //feach divice model
  const fetchDeviceModels = useCallback(async () => {
    if (isDeviceLoaded) return;
    setIsDeviceLoading(true);
    try {
      const authToken = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/device-models`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      //  console.log("Fetched Device Models:", response.data.DeviceModel);
      setfetchDeviceModels(response.data.DeviceModel || []); // Update state with fetched data
      setIsDeviceLoaded(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
          ? (axiosError.response.data as { message: string }).message
          : "Error occurred while fetching device models.";
      toast.error(errorMessage); // Display error message
    } finally {
      setIsDeviceLoading(false);
    }
  }, [isDeviceLoaded]);

  useEffect(() => {
    if (!isNotificationsLoaded) {
      fetchNotifications();
    }
  }, [isNotificationsLoaded]);

  useEffect(() => {
    if (!isFAQsLoaded) {
      fetchFAQs();
    }
  }, [isFAQsLoaded]);

  useEffect(() => {
    if (!isContactMessagesLoaded) {
      fetchContactMessages();
    }
  }, [isContactMessagesLoaded]);

  useEffect(() => {
    if (!isReviewsLoaded) {
      fetchReviews();
    }
  }, [isReviewsLoaded]);

  useEffect(() => {
    if (!isServicesLoaded) {
      fetchServices();
    }
  }, [isServicesLoaded]);

  useEffect(() => {
    if (!isDeviceLoaded) {
      fetchDeviceModels();
    }
  }, [isDeviceLoaded]);

  return (
    <RepairRequestsContext.Provider
      value={{
        repairRequests,
        notifications,
        faqs,
        contactMessages,
        reviews,
        services,
        deviceModels,
        fetchRepairRequests,
        fetchNotifications,
        fetchFAQs,
        fetchContactMessages,
        fetchReviews,
        fetchServices,
        fetchDeviceModels,
        isLoading,
        isNotificationsLoading,
        isFAQsLoading,
        isContactMessagesLoading,
        isReviewsLoading,
        isServicesLoading,
        isDeviceLoading,
      }}
    >
      {children}
    </RepairRequestsContext.Provider>
  );
};

export const useRepairRequests = (): RepairRequestsContextProps => {
  const context = useContext(RepairRequestsContext);
  if (!context) {
    throw new Error(
      "useRepairRequests must be used within a RepairRequestsProvider"
    );
  }
  return context;
};
