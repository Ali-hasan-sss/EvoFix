import { useEffect } from "react";

const ChatbotButton = () => {
  useEffect(() => {
    // إضافة كود Tidio للدردشة
    const script = document.createElement("script");
    script.src = "//code.tidio.co/your-tidio-code.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button
      className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      onClick={() => {
        // فتح شات بوت Tidio
        if (window.tidioChatApi) {
          window.tidioChatApi.open();
        }
      }}
    >
      💬
    </button>
  );
};

export default ChatbotButton;
