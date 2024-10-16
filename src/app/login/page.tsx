"use client";
import React, { useState, useContext } from "react";
import Navbar from "@/components/navBar";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginForm = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // لإظهار كلمة المرور

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!validateEmail(email)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صالح.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("يجب أن تكون كلمة المرور على الأقل 8 أحرف.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const userId = response.data.info.id;
        const userRole = response.data.info.role;
        const userEmail = response.data.info.email;
        const token = response.data.token; // استقبل التوكن من الاستجابة

        Cookies.set("token", token, {
          expires: 7, // حفظ التوكن لمدة 7 أيام
          secure: process.env.NODE_ENV === "production",
        });

        localStorage.setItem("userId", userId);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("userRole", userRole);

        toast.success(response.data.message || "تم تسجيل الدخول بنجاح!");
        login(userEmail, userId);

        // التوجيه بناءً على صلاحيات المستخدم
        if (userRole === "ADMIN") {
          router.push("/admindashboard");
        } else if (userRole === "TECHNICAL") {
          router.push("/technicaldashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMessage(
          "خطأ في تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور."
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          `حدث خطأ: ${error.response.data.message || "غير معروف"}`
        );
      } else {
        setErrorMessage("تعذر الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div
        className={`flex justify-center items-center h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`p-8 rounded shadow-md w-full max-w-sm ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-500 text-gray-800"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">تسجيل الدخول</h2>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 border-b focus:outline-none rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                } `}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-0 top-0 mt-2 ml-2"
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <p className="m-2">
            <a className="text-blue-200 p-1" href="register">
              ليس لدي حساب
            </a>
          </p>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
