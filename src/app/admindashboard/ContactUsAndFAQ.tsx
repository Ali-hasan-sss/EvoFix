import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { API_BASE_URL } from "@/utils/api";
import Cookies from "js-cookie";
import { ThemeContext } from "../ThemeContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from "react-switch";

interface ContactMessage {
  id: number;
  content: string;
  email: string;
  subject: string;
  sentAt: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  isPublished: boolean;
}

const ContactUsAndFAQ: React.FC = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingContact, setLoadingContact] = useState<boolean>(true);
  const [loadingFAQ, setLoadingFAQ] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"contact" | "faq">("contact");
  const [error, setError] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null); // لحفظ معرف السؤال المحدد لإضافة الجواب
  const [answer, setAnswer] = useState<string>("");

  const { isDarkMode } = useContext(ThemeContext);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/contact-us`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContactMessages(response.data.adminContactUs);
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
            Authorization: `Bearer ${token}`,
          },
        });
        setFaqs(response.data.faqs);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الأسئلة الشائعة.");
      } finally {
        setLoadingFAQ(false);
      }
    };

    fetchContactMessages();
    fetchFAQs();
  }, [token]);

  const handleTabChange = (tab: "contact" | "faq") => {
    setActiveTab(tab);
  };

  const handleTogglePublish = async (faqId: number, isPublished: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/fAQ/${faqId}`,
        { isPublished: !isPublished },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) =>
          faq.id === faqId ? { ...faq, isPublished: !isPublished } : faq
        )
      );
      toast.success("تم تحديث حالة النشر بنجاح.");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة النشر.");
    }
  };

  const handleAddAnswer = async (faqId: number) => {
    try {
      await axios.put(
        `${API_BASE_URL}/fAQ/${faqId}`,
        { answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) => (faq.id === faqId ? { ...faq, answer } : faq))
      );
      setAnswer("");
      setSelectedFaq(null);
      toast.success("تم إضافة الإجابة بنجاح.");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الإجابة.");
    }
  };

  return (
    <div
      className={`mt-5 p-5 border rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-900 text-light" : "bg-gray-200 text-black"
      } `}
    >
      <h2 className="text-xl font-semibold mb-4">اتصل بنا والأسئلة الشائعة</h2>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleTabChange("contact")}
          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
            activeTab === "contact" ? "bg-blue-500 text-white" : "bg-blue-300"
          }`}
        >
          رسائل اتصل بنا
        </button>
        <button
          onClick={() => handleTabChange("faq")}
          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
            activeTab === "faq" ? "bg-blue-500 text-white" : "bg-blue-300"
          }`}
        >
          الأسئلة الشائعة
        </button>
      </div>
      {/*   contact us    */}
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
                  {message.subject} ({message.email})
                </h3>
                <p>{message.content}</p>
                <p className="text-gray-500 text-small">
                  {new Date(message.sentAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      {/*   FAQ    */}
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
            <li
              key={faq.id}
              className={`border rounded-lg p-4 shadow${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-200 text-gray-800 border-gray-400"
              }`}
            >
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="text-sm text-gray-500">
                {faq.isPublished ? "منشور" : "غير منشور"}
              </p>
              <Switch
                checked={faq.isPublished}
                onChange={() => handleTogglePublish(faq.id, faq.isPublished)}
                onColor="#4A90E2"
                offColor="#FF6347"
                height={20}
                width={40}
              />
              <span className="mr-2">تفعيل / إلغاء تفعيل</span>
              {faq.answer && (
                <p className="mt-2 text-green-600">الإجابة: {faq.answer}</p>
              )}
              {selectedFaq === faq.id ? (
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="أدخل الإجابة"
                    className="p-2 border rounded mr-2 flex-1 text-black"
                  />
                  <button
                    onClick={() => handleAddAnswer(faq.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    إرسال
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedFaq(faq.id)}
                  className="mt-2 py-2 px-4 bg-blue-500 rounded hover:bg-blue-400 block"
                >
                  إضافة إجابة
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactUsAndFAQ;
