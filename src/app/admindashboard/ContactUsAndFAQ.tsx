// src/components/ContactUsAndFAQ.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader"; // استيراد سبينر
import { API_BASE_URL } from "@/utils/api";
import Cookies from "js-cookie";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const ContactUsAndFAQ: React.FC = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingContact, setLoadingContact] = useState<boolean>(true);
  const [loadingFAQ, setLoadingFAQ] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"contact" | "faq">("contact");
  const [error, setError] = useState<string | null>(null);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/contact-us`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContactMessages(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب رسائل اتصل بنا.");
      } finally {
        setLoadingContact(false);
      }
    };

    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fAQ`, {
          headers: {
            Authorization: `Bearer ${token}`, // إضافة هيدر التوكن
          },
        });
        setFaqs(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الأسئلة الشائعة.");
      } finally {
        setLoadingFAQ(false);
      }
    };

    fetchContactMessages();
    fetchFAQs();
  }, [token]); // تأكد من إضافة التوكن كاعتماد في الـ useEffect

  const handleTabChange = (tab: "contact" | "faq") => {
    setActiveTab(tab);
  };

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">اتصل بنا والأسئلة الشائعة</h2>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleTabChange("contact")}
          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
            activeTab === "contact" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          رسائل اتصل بنا
        </button>
        <button
          onClick={() => handleTabChange("faq")}
          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
            activeTab === "faq" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          الأسئلة الشائعة
        </button>
      </div>

      {activeTab === "contact" && loadingContact && (
        <div className="flex items-center">
          <ClipLoader size={30} color={"#000"} loading={loadingContact} />
          <p className="ml-2">جارٍ تحميل رسائل اتصل بنا...</p>
        </div>
      )}
      {activeTab === "contact" && error && (
        <p className="text-red-500">{error}</p>
      )}
      {activeTab === "contact" &&
        !loadingContact &&
        contactMessages.length === 0 && <p>لا توجد رسائل اتصل بنا.</p>}
      {activeTab === "contact" &&
        !loadingContact &&
        contactMessages.length > 0 && (
          <ul className="space-y-4">
            {contactMessages.map((message) => (
              <li key={message.id} className="border rounded-lg p-4 shadow">
                <h3 className="font-semibold">
                  {message.name} ({message.email})
                </h3>
                <p>{message.message}</p>
              </li>
            ))}
          </ul>
        )}

      {activeTab === "faq" && loadingFAQ && (
        <div className="flex items-center">
          <ClipLoader size={30} color={"#000"} loading={loadingFAQ} />
        </div>
      )}
      {activeTab === "faq" && error && <p className="text-red-500">{error}</p>}
      {activeTab === "faq" && !loadingFAQ && faqs.length === 0 && (
        <p>لا توجد أسئلة شائعة.</p>
      )}
      {activeTab === "faq" && !loadingFAQ && faqs.length > 0 && (
        <ul className="space-y-4">
          {faqs.map((faq) => (
            <li key={faq.id} className="border rounded-lg p-4 shadow">
              <h3 className="font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactUsAndFAQ;
