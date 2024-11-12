import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useRepairRequests } from "@/app/context/adminData";
import Switch from "react-switch";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "@/utils/api";
import axios from "axios";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ContactUsAndFAQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"messages" | "faqs">("messages");
  const { faqs = [], fetchFAQs, isFAQsLoading } = useRepairRequests();
  const {
    contactMessages = [],
    fetchContactMessages,
    isContactMessagesLoading,
  } = useRepairRequests();
  const [localFaqs, setLocalFaqs] = useState(faqs);
  const [localContactMessages, setLocalContactMessages] =
    useState(contactMessages);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const { isDarkMode } = useContext(ThemeContext);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchFAQs();
    fetchContactMessages();
  }, []);

  useEffect(() => {
    setLocalFaqs(faqs);
  }, [faqs]);

  useEffect(() => {
    setLocalContactMessages(contactMessages);
  }, [contactMessages]);

  const handleTogglePublish = async (faqId: number, isPublished: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/fAQ/${faqId}`,
        { isPublished: !isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedFaqs = localFaqs.map((faq) =>
        faq.id === faqId ? { ...faq, isPublished: !isPublished } : faq
      );
      setLocalFaqs(updatedFaqs);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedFaqs = localFaqs.map((faq) =>
        faq.id === faqId ? { ...faq, answer } : faq
      );
      setLocalFaqs(updatedFaqs);
      setAnswer("");
      setSelectedFaq(null);
      toast.success("تم إضافة الإجابة بنجاح.");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الإجابة.");
    }
  };

  const handleDelete = (id: number, type: "contact" | "faq") => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/${
                  type === "contact" ? "contact-us" : "fAQ"
                }/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (type === "faq") {
                setLocalFaqs(localFaqs.filter((faq) => faq.id !== id));
              } else {
                setLocalContactMessages(
                  localContactMessages.filter((message) => message.id !== id)
                );
              }
              toast.success("تم حذف العنصر بنجاح.");
            } catch (error) {
              toast.error("حدث خطأ أثناء الحذف.");
            }
          },
        },
        {
          label: "لا",
          onClick: () => {}, // لا تفعل شيئاً إذا تم اختيار "لا"
        },
      ],
    });
  };

  return (
    <div
      className={`mt-5 p-5 border rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-900 text-light" : "bg-gray-200 text-black"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">اتصل بنا والأسئلة الشائعة</h2>

      {/* التبويبات */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 ${
            activeTab === "messages"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          الرسائل
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-4 py-2 ${
            activeTab === "faqs"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          الأسئلة الشائعة
        </button>
      </div>

      {/* محتوى الرسائل */}
      {activeTab === "messages" &&
        !isContactMessagesLoading &&
        localContactMessages.length > 0 && (
          <ul className="space-y-4">
            {localContactMessages.map((message) => (
              <li key={message.id} className="border rounded-lg p-4 shadow">
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {message.subject} ({message.email})
                  </h3>
                  <button onClick={() => handleDelete(message.id, "contact")}>
                    <FaTrash className="text-red-500 cursor-pointer" />
                  </button>
                </div>
                <p>{message.content}</p>
                <p className="text-gray-500 text-small">
                  {new Date(message.sentAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

      {/* محتوى الأسئلة الشائعة */}
      {activeTab === "faqs" && !isFAQsLoading && localFaqs.length > 0 && (
        <ul className="space-y-4">
          {localFaqs.map((faq) => (
            <li key={faq.id} className="border rounded-lg p-4 shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">{faq.question}</h3>
                <button onClick={() => handleDelete(faq.id, "faq")}>
                  <FaTrash className="text-red-500 cursor-pointer" />
                </button>
              </div>
              <p className="text-sm text-green-500">{faq.answer}</p>
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
              {selectedFaq === faq.id ? (
                <div className="mt-2 flex flex-col sm:flex-row items-center">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="أدخل الإجابة"
                    className="p-2 border rounded mb-2 sm:mb-0 sm:mr-2 flex-grow text-black"
                  />
                  <button
                    onClick={() => handleAddAnswer(faq.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    إرسال
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedFaq(faq.id)}
                  className="mt-2 py-2 px-4 bg-blue-500 rounded hover:bg-blue-400 block"
                >
                  {faq.answer ? "تعديل الاجابة" : "اضافة اجابة"}
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
