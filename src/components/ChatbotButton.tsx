"use client";

import React, { useState } from "react";
import { AiOutlineRobot } from "react-icons/ai";
import ChatWindow from "./ChatWindow";

const ChatBotButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-20 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-50"
      >
        <AiOutlineRobot size={24} />
      </button>
      {isChatOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};

export default ChatBotButton;
