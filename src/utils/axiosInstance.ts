import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "https://evo-fix-api.vercel.app/api";

// إنشاء axios instance مع إعداد الهيدر الأساسي
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// استخدام التوكن من الكوكيز مع كل طلب
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// تعريف نوع للبيانات العامة
type ApiResponse<T> = {
  data: T;
  message?: string;
  response: T;
};

// تصدير الدوال العامة لعمليات الشبكة
export const getData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await axiosInstance.get<ApiResponse<T>>(endpoint);
    const data = response.data.data;

    // تأكد من أن البيانات تتطابق مع النوع T
    if (data !== null && data !== undefined) {
      if (typeof data === "object" || typeof data === "string") {
        return data as T; // استخدم type assertion هنا
      } else {
        throw new Error("البيانات غير صحيحة أو غير موجودة.");
      }
    } else {
      throw new Error("البيانات غير صحيحة أو غير موجودة.");
    }
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const postData = async <T, R>(
  endpoint: string,
  data: T
): Promise<ApiResponse<R>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<R>>(endpoint, data);
    return response.data; // إرجاع الاستجابة الكاملة
  } catch (error) {
    handleError(error);
    throw error; // إعادة طرح الخطأ بعد التعامل معه
  }
};

export const putData = async <T, R>(endpoint: string, data: T): Promise<R> => {
  try {
    const response = await axiosInstance.put<ApiResponse<R>>(endpoint, data);
    return response.data.data; // إرجاع البيانات فقط
  } catch (error) {
    handleError(error);
    throw error; // إعادة طرح الخطأ بعد التعامل معه
  }
};

export const deleteData = async (endpoint: string): Promise<void> => {
  try {
    await axiosInstance.delete(endpoint);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// دالة للتعامل مع الأخطاء
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // إذا كان الخطأ من نوع Axios
    const message = error.response?.data?.message || "حدث خطأ غير معروف.";
    console.error("Error:", message);
  } else {
    console.error("Unexpected error:", error);
  }
};

export default axiosInstance;
