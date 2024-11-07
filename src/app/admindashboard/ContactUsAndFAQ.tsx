import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { API_BASE_URL } from "@/utils/api";
import Cookies from "js-cookie";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from "react-switch";
import { FaTrash } from "react-icons/fa";

// Define the types for contact messages and FAQs
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
  // State variables to manage contact messages, FAQs, loading states, and error messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingContact, setLoadingContact] = useState<boolean>(true);
  const [loadingFAQ, setLoadingFAQ] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"contact" | "faq">("contact");
  const [error, setError] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string>("");
  // Access the theme context and get the token from cookies
  const { isDarkMode } = useContext(ThemeContext);
  const token = Cookies.get("token");

  // Effect to fetch contact messages and FAQs when the component mounts
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

  // Function to handle tab change between contact messages and FAQs
  const handleTabChange = (tab: "contact" | "faq") => {
    setActiveTab(tab);
  };

  // Function to toggle the publish status of a FAQ
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
      // Update the FAQ list in state
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

  // Function to add an answer to a FAQ
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
      // Update the FAQ list in state
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

  // Function to delete a contact message or FAQ
  const handleDelete = async (id: number, type: "contact" | "faq") => {
    try {
      await axios.delete(
        `${API_BASE_URL}/${type === "contact" ? "contact-us" : "fAQ"}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (type === "contact") {
        setContactMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== id)
        );
      } else {
        setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id));
      }
      toast.success("تم حذف العنصر بنجاح.");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف.");
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
        {/* Button for Contact Messages tab */}
        <button
          onClick={() => handleTabChange("contact")}
          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
            activeTab === "contact" ? "bg-blue-500 text-white" : "bg-blue-300"
          }`}
        >
          رسائل اتصل بنا
        </button>
        {/* Button for FAQs tab */}
        <button
          onClick={() => handleTabChange("faq")}
          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
            activeTab === "faq" ? "bg-blue-500 text-white" : "bg-blue-300"
          }`}
        >
          الأسئلة الشائعة
        </button>
      </div>

      {/* Contact Messages */}
      {activeTab === "contact" &&
        !loadingContact &&
        contactMessages.length > 0 && (
          <ul className="space-y-4">
            {contactMessages.map((message) => (
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

      {/* FAQs */}
      {activeTab === "faq" && !loadingFAQ && faqs.length > 0 && (
        <ul className="space-y-4">
          {faqs && faqs.length > 0 ? (
            faqs.map((faq) => (
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
                {/* Switch for toggling FAQ publish status */}
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
            ))
          ) : (
            <p>لا توجد أسئلة متاحة حاليًا.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ContactUsAndFAQ;
