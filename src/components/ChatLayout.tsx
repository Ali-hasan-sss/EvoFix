"use client"; // هذا المكون هو مكون عميل

import React, { useState } from "react";
import ChatBot from "../components/ChatbotButton";

const ChatLayout: React.FC = ({ children }) => {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <>
      {children}
      {/* زر الدردشة العائم */}
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none"
        aria-label="Chat with AI"
      >
        💬
      </button>

      {/* عرض نافذة الدردشة إذا كانت مفتوحة */}
      {chatOpen && (
        <div className="fixed bottom-20 right-8 w-96 bg-white shadow-lg rounded-lg p-4">
          <ChatBot onClose={toggleChat} />
        </div>
      )}
    </>
  );
};

export default ChatLayout;
