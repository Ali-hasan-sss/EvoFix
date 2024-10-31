import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa"; // استيراد الأيقونات المطلوبة
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
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
  const { isDarkMode } = useContext(ThemeContext);
  // جلب الأسئلة الشائعة عند التحميل
  const fetchFAQs = async () => {
    try {
      const response = await axios.get<{ faqs: FAQItem[] }>(
        `${API_BASE_URL}/fAQ`
      );
      setFaqs(response.data.faqs); // الحصول على البيانات داخل خاصية `faqs`
      console.log(response.data.faqs);
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

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/fAQ`, {
        question: newQuestion, // إرسال السؤال فقط
      });
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
      <div
        className={`space-y-1 ${
          isDarkMode ? "bg-gray-800 text-light" : "bg-blue-200 text-black"
        }`}
      >
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border border-yellow-500 rounded-lg p-4">
            <button
              onClick={() => toggleExpand(index)}
              className="w-full text-right font-semibold flex justify-between items-center"
            >
              {faq.question}
              {expandedIndex === index ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
            {expandedIndex === index && (
              <div className=" text-right">
                <p className="text-sm text-green-500">
                  {faq.answer || "لم تتم الإجابة بعد"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* إضافة سؤال جديد */}
      <div className="mt-2 p-4 border border-yellow-500 rounded-lg ">
        <h3 className="text-lg font-bold mb-2">طرح سؤال جديد</h3>
        <form onSubmit={handleNewQuestionSubmit}>
          <div className="mb-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="أدخل السؤال هنا"
              className="w-full p-2 border rounded text-black"
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
                <FaChevronUp className="ml-3" /> إرسال السؤال
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FAQ;
