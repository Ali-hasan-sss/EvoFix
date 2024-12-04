"use client";

import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../../app/context/ThemeContext";
const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // تحقق من تعبئة الحقول المطلوبة
    if (!email || !subject || !content) {
      toast.error("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/contact-us`, {
        email,
        subject,
        content,
      });

      // رسالة تأكيد الإرسال
      toast.success("تم إرسال رسالتك بنجاح!");

      // إعادة تعيين الحقول بعد الإرسال
      setEmail("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الرسالة:", error);
      toast.error("فشل في إرسال الرسالة. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-md mx-auto p-6 rounded login `}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">اتصل بنا</h2>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2  rounded outline-none ${
            isDarkMode ? "shadow-dark dark-bg-1" : "shadow-light light-bg-1"
          }`}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="subject" className="block mb-2">
          الموضوع
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`w-full p-2  rounded outline-none ${
            isDarkMode ? "shadow-dark dark-bg-1" : "shadow-light light-bg-1"
          }`}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block mb-2">
          المحتوى
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full p-2  rounded outline-none  ${
            isDarkMode ? "shadow-dark dark-bg-1" : "shadow-light light-bg-1"
          }`}
          rows={4}
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4  text-white mt-4 btn-submit "
        disabled={isLoading}
      >
        {isLoading ? "جاري الإرسال..." : "إرسال"}
      </button>
    </form>
  );
};

export default ContactForm;
