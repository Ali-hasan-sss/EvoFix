"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeContext } from "../context/ThemeContext";
import PasswordResetForm from "@/components/forms/PasswordResetForm";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // إضافة حالة التحميل
  const { isDarkMode } = useContext(ThemeContext);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tokenParam = query.get("token");
    const idParam = query.get("id");

    if (tokenParam && idParam) {
      setToken(tokenParam);
      setUserId(idParam);
    } else {
      setErrorMessage("المعلمات غير صحيحة.");
    }
  }, []);

  const validatePassword = (password: string) => password.length >= 8;

  const handleSubmit = async (newPassword: string, confirmPassword: string) => {
    if (!validatePassword(newPassword)) {
      setErrorMessage("كلمة المرور يجب أن تكون أكثر من 8 أحرف");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    setLoading(true); // تعيين حالة التحميل إلى true

    try {
      await axios.post(`${API_BASE_URL}/users/reset-password`, {
        newPassword,
        id: userId,
        token,
      });

      router.push("/");
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false); // تعيين حالة التحميل إلى false بعد انتهاء الطلب
    }
  };

  return (
    <div
      className={`flex justify-center items-center h-screen ${
        isDarkMode ? "bg-gray-200 text-black" : "bg-gray-800 text-light"
      }`}
    >
      <PasswordResetForm
        onSubmit={handleSubmit}
        password={password}
        confirmPassword={confirmPassword}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        darkMode={isDarkMode}
        loading={loading} // تمرير حالة التحميل للمكون
      />
    </div>
  );
}
