"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const tokenParam = query.get("token");
      const idParam = query.get("id");

      if (tokenParam && idParam) {
        verifyEmail(tokenParam, idParam);
      } else {
        setErrorMessage("المعلمات غير صحيحة.");
        setLoading(false);
      }
    }
  }, []);

  const verifyEmail = async (token: string, id: string) => {
    try {
      await axios.post(`${API_BASE_URL}/users/verify-email`, {
        verifyToken: token,
        id: parseInt(id, 10),
      });

      // تحديث localStorage بعد نجاح التحقق
      localStorage.setItem("isVerified", "true");

      // إعادة التوجيه إلى الصفحة الرئيسية أو أي صفحة أخرى
      router.push("/");
    } catch (error) {
      console.error("Verification failed:", error);
      setErrorMessage("حدث خطأ أثناء التحقق.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <div className="spinner">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
};

export default VerifyEmail;
