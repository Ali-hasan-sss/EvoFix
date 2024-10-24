import React, { useEffect, useState } from "react";
import { websoketURL } from "@/utils/api";

const WebSocketTest: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // دالة لجلب التوكن من الكوكيز
  const getTokenFromCookies = (): string | null => {
    const cookieString = document.cookie;
    const cookies = cookieString
      .split("; ")
      .reduce((acc: { [key: string]: string }, current) => {
        const [name, value] = current.split("=");
        acc[name] = value;
        return acc;
      }, {});

    return cookies["token"] || null; // تعديل الاسم ليتناسب مع اسم التوكن في الكوكيز
  };

  useEffect(() => {
    const token = getTokenFromCookies(); // جلب التوكن من الكوكيز

    if (token) {
      const socketUrl = `${websoketURL}?userId=4`;

      try {
        const ws = new WebSocket(socketUrl);

        ws.onopen = () => {
          console.log("Connected to WebSocket");
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          const message = event.data;
          console.log("Received message:", message);
          setMessages((prevMessages) => [...prevMessages, message]);
        };

        ws.onerror = (event) => {
          console.error("WebSocket error:", event);
          setError("حدث خطأ في الاتصال بـ WebSocket");
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
          setIsConnected(false);
        };

        setSocket(ws);
      } catch (err) {
        setError("فشل الاتصال بـ WebSocket");
      }
    } else {
      setError("لا يوجد توكن متوفر.");
    }

    // تنظيف الاتصال عند إلغاء المكون
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>اختبار WebSocket</h1>
      {isConnected ? <p>متصل بـ WebSocket</p> : <p>غير متصل بـ WebSocket</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <h2>الرسائل المستلمة:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketTest;
