import React, { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";

interface ResetPasswordFormProps {
  onClose: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  // تحقق من صحة البريد الإلكتروني
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // دالة لمعالجة إرسال الفورم
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users/request-reset-password`, {
        email,
      });
      toast.success(
        "تم إرسال طلب استعادة كلمة المرور بنجاح، يرجى التحقق من بريدك الإلكتروني"
      );
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${
        isDarkMode ? "dark-bg-1" : "light-bg-1"
      }`}
    >
      <h2 className="text-2xl font-semibold text-center mb-4">
        استعادة كلمة المرور
      </h2>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          البريد الإلكتروني
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example@example.com"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full btn-submit"
          disabled={loading}
        >
          {loading ? "جاري الإرسال..." : "إرسال"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordForm;
