"use client";

import React, { useContext, useState } from "react";
import ChatWindow from "./ChatWindow";
import { ThemeContext } from "@/app/context/ThemeContext";
import Image from "next/image";
import icon from "@/components/assets/images/chat.png";
const ChatBotButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed  bottom-20 right-5  text-white p-3 rounded-full  z-20 fixed-btn `}
      >
        <Image
          src={icon}
          alt={"ai icon"}
          width={70}
          height={70}
          className="rounded-lg object-cover w-full h-[40px]"
        />
        <h3 className="absolute top-5 left-6">AI</h3>
      </button>
      {isChatOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};

export default ChatBotButton;
