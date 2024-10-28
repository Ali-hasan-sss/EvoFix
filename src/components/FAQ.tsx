import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie
import { API_BASE_URL } from "@/utils/api";

// تعريف نوع الأسئلة الشائعة
interface FAQItem {
  id: number; // معرف السؤال
  question: string; // نص السؤال
  answer: string | null; // نص الإجابة (قد تكون null إذا لم يكن هناك إجابة بعد)
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]); // القيمة الافتراضية مصفوفة فارغة
  const [newQuestion, setNewQuestion] = useState(""); // سؤال جديد
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // لإدارة تحميل الطلب

  // جلب الأسئلة الشائعة عند التحميل
  const fetchFAQs = async () => {
    try {
      const response = await axios.get<FAQItem[]>(`${API_BASE_URL}/fAQ`);
      setFaqs(response.data); // تأكد أن البيانات من API تتوافق مع نوع FAQItem
    } catch (error) {
      console.error("خطأ في جلب الأسئلة:", error);
      toast.error("حدث خطأ أثناء جلب الأسئلة الشائعة.");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // إرسال سؤال جديد
  const handleNewQuestionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!newQuestion) {
      toast.error("يرجى إدخال السؤال.");
      return;
    }

    // التحقق من وجود توكن
    const token = Cookies.get("token");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    if (!token || !email || !userId) {
      toast.error("يجب تسجيل الدخول لإرسال سؤالك."); // إظهار رسالة التوست هنا
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/fAQ`,
        {
          question: newQuestion, // إرسال السؤال فقط
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // تضمين التوكن في الهيدر
          },
        }
      );
      toast.success("تم إرسال السؤال بنجاح!");

      // إعادة تحميل الأسئلة بعد الإرسال
      fetchFAQs();

      // إعادة تعيين الحقول بعد الإرسال
      setNewQuestion("");
    } catch (error) {
      console.error("خطأ في إضافة السؤال:", error);
      toast.error("حدث خطأ أثناء إرسال السؤال.");
    } finally {
      setIsLoading(false);
    }
  };

  // توسيع أو طي السؤال
  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">الأسئلة الشائعة</h2>

      {/* عرض الأسئلة الشائعة */}
      <div className="space-y-4">
        {Array.isArray(faqs) &&
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-700"
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full text-right font-semibold flex justify-between"
              >
                {faq.question}
                {expandedIndex === index ? "-" : "+"}
              </button>
              {expandedIndex === index && (
                <div className="mt-2 text-right">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {faq.answer || "لم تتم الإجابة بعد"}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* إضافة سؤال جديد */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-bold mb-2">طرح سؤال جديد</h3>
        <form onSubmit={handleNewQuestionSubmit}>
          <div className="mb-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="أدخل السؤال هنا"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              "جاري الإرسال..."
            ) : (
              <>
                <FaPlus className="mr-2" /> إرسال السؤال
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FAQ;
