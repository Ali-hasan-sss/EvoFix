import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaXRay,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* شروط الاستخدام */}
        <div className="text-sm">
          <a href="/terms" className="hover:underline">
            شروط الاستخدام
          </a>
        </div>

        {/* حقوق النشر */}
        <div className="text-sm">
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </div>

        {/* أيقونات التواصل الاجتماعي */}
        <div className="flex space-x-4 text-2xl">
          <a
            href="https://www.facebook.com/mohammad.salman.1998"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com/in/mohammad-salman-779559263"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://x.com/M1998Salman"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaTwitter />
          </a>
          <a
            href="mailto:evolutionfix8@gmail.com"
            className="hover:text-red-500"
          >
            <FaEnvelope />
          </a>

          <a
            href="https://api.whatsapp.com/send/?phone=+963960950112"
            className="hover:text-green-500"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
