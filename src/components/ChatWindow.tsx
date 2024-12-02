"use client";

import React from "react";
import { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "@/app/context/ThemeContext";

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`fixed bottom-20 right-5 w-80 h-96 rounded-lg shadow-lg z-50
        ${
          isDarkMode
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-400 text-black"
        }
    `}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">دردشة الذكاء الصناعي</h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-300">
          <AiOutlineClose size={20} />
        </button>
      </div>
      <div className="h-full">
        <iframe
          src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/11/29/17/20241129173014-8P65E5NZ.json"
          title="AI Chatbot"
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
      </div>
    </div>
  );
};

export default ChatWindow;
