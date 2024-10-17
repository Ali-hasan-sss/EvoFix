"use client";

import React from "react";
import { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "@/app/ThemeContext";

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`fixed bottom-20  right-5 w-80  rounded-lg shadow-lg z-50
        ${
          isDarkMode
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-400 text-blach"
        }
    `}
    >
      <div className="flex justify-between items-center p-4 border-b ">
        <h2 className="text-lg font-semibold">دردشة الذكاء الصناعي</h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-300">
          <AiOutlineClose size={20} />
        </button>
      </div>
      <div className="p-4 ">
        {/* هنا يمكنك إضافة مكونات الدردشة أو تكامل مع API */}
        <p>مرحبا! كيف يمكنني مساعدتك اليوم؟</p>
      </div>
      <div className="p-4 border-t ">
        <input
          type="text"
          placeholder="اكتب رسالتك..."
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default ChatWindow;
