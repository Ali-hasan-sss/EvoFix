"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../context/ThemeContext";

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
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
      // التعامل مع حالة عدم وجود المعلمات
      setErrorMessage("المعلمات غير صحيحة.");
    }
  }, []);

  const validatePassword = (password: string) => password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setErrorMessage("كلمة المرور يجب أن تكون أكثر من 8 أحرف");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users/reset-password`, {
        newPassword: password,
        id: userId,
        token: token,
      });

      router.push("/");
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء إعادة تعيين كلمة المرور");
    }
  };

  return (
    <div
      className={`flex justify-center items-center h-screen ${
        isDarkMode ? "bg-gray-200 text-black" : "bg-gray-800 text-light"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded shadow-md w-full max-w-sm bg-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          تعيين كلمة مرور جديدة
        </h2>

        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}

        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-2">
            كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-2 top-1 mt-2 mr-2"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block font-bold mb-2">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-2 top-1 mt-2 mr-2"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          تحديث كلمة المرور
        </button>
      </form>
    </div>
  );
}
