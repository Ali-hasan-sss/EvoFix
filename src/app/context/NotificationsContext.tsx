import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// تعريف نوع الإشعارات
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

// إنشاء سياق للإشعارات
interface NotificationsContextProps {
  notifications: APINotification[];
  loading: boolean;
  error: string | null;
}

const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  loading: false,
  error: null,
});

// تصدير hook لاستخدام السياق
export const useNotifications = () => useContext(NotificationsContext);

// مزود السياق
export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<APINotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    const authToken = token ? token.split("=")[1] : "";

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        setError("خطأ في جلب الإشعارات");
        setLoading(false);
      }
    };

    fetchNotifications();

    // تأسيس اتصال WebSocket
    const socket = new WebSocket(`wss://${API_BASE_URL}/notifications`);

    socket.onopen = () => {
      console.log("WebSocket Connection Established");
      socket.send(JSON.stringify({ token: authToken }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_NOTIFICATION") {
        const newNotification: APINotification = {
          id: data.id,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt,
          senderId: data.senderId,
          isRead: false,
          requestId: data.requestId,
          request: {
            isPaidCheckFee: data.request?.isPaidCheckFee ?? false,
            isPaid: data.request?.isPaid ?? false,
          },
          recipientId: data.recipientId,
        };

        // إضافة الإشعار الجديد إلى القائمة
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, loading, error }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// تصدير السياق
export default NotificationsContext;
