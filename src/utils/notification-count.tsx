import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "./api";

// دالة لجلب عدد الإشعارات
export const fetchNotificationsCount = async (): Promise<number> => {
  const token = Cookies.get("token");
  if (token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.count;
    } catch (error: unknown) {
      console.error("خطأ في جلب عدد الإشعارات", error);
      throw error;
    }
  }
  return 0; // إذا لم يكن هناك توكن
};

// دالة تضيف آلية التحديث كل دقيقة
export const startNotificationsCount = (
  callback: (count: number) => void,
  interval: number = 60000 // الفاصل الزمني الافتراضي دقيقة واحدة
): (() => void) => {
  // استدعاء أولي لجلب البيانات
  const fetchAndUpdate = async () => {
    try {
      const count = await fetchNotificationsCount();
      callback(count); // تحديث القيمة باستخدام الـ callback
    } catch (error) {
      console.error("خطأ أثناء التحديث التلقائي", error);
    }
  };

  fetchAndUpdate(); // أول تحديث

  // إعداد الفاصل الزمني للتحديث
  const intervalId = setInterval(fetchAndUpdate, interval);

  // دالة لإيقاف التحديث عند الحاجة
  return () => clearInterval(intervalId);
};
