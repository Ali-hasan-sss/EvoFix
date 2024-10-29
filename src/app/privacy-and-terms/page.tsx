"use client";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/navBar";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";
import { API_BASE_URL } from "@/utils/api";

// تعريف واجهة TermPolicy
interface TermPolicy {
  id: number;
  version: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function PrivacyAndTerms() {
  const { isDarkMode } = useContext(ThemeContext);
  const [termsPolicy, setTermsPolicy] = useState<TermPolicy[]>([]); // تحديد نوع البيانات هنا
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the terms and policies data
    const fetchTermsAndPolicy = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/termsOfUsePolicy`);
        setTermsPolicy(response.data.TermsPolicy); // استخدام البيانات من الاستجابة
      } catch (error) {
        console.error("Error fetching terms and policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTermsAndPolicy();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">جاري التحميل...</div>;
  }

  return (
    <>
      <Navbar />
      <div
        className={`mx-auto mt-20 px-4 py-8 text-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
        }`}
        style={{ minHeight: "100vh", marginTop: "75px" }}
      >
        <h1 className="text-3xl text-center font-bold mb-4">
          سياسة الخصوصية وشروط الاستخدام
        </h1>

        {termsPolicy.map(
          (policy) =>
            policy.title && ( // تأكد من أن العنوان ليس فارغًا
              <section key={policy.id} className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">{policy.title}</h2>
                <p className="mb-4">{policy.content}</p>
              </section>
            )
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-2">اتصل بنا</h2>
          <p>
            إذا كان لديك أي استفسارات حول سياسة الخصوصية أو شروط الاستخدام، لا
            تتردد في التواصل معنا من خلال قسم الدعم في الموقع.
          </p>
        </section>
        <a href="/" className="text-blue-500 m-0 -p-0">
          العودة الى الصفحة الرئيسية
        </a>
      </div>
    </>
  );
}
