"use client";

import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import Image from "next/image";
import icon from "@/components/assets/images/chat.png";
const ChatBotButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed  bottom-20 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-20"
      >
        <Image
          src={icon}
          alt={"ai icon"}
          width={50}
          height={50}
          className="rounded-lg object-cover w-full h-[40px]"
        />
        <h3 className="absolute top-5 left-6">AI</h3>
      </button>
      {isChatOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};

export default ChatBotButton;
