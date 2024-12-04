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
    <footer className=" py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* شروط الاستخدام */}
        <div className="text-sm">
          <a href="/terms" className="hover:underline">
            شروط الاستخدام
          </a>
        </div>

        {/* حقوق النشر */}
        <div className="text-sm">
          © {new Date().getFullYear()} جميع الحقوق محفوظة || EVOFIX
        </div>

        {/* أيقونات التواصل الاجتماعي */}
        <div className="flex text-2xl">
          <a
            href="https://www.facebook.com/mohammad.salman.1998"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 mx-2"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com/in/mohammad-salman-779559263"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 mx-2"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://x.com/M1998Salman"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 mx-2"
          >
            <FaTwitter />
          </a>
          <a
            href="mailto:evolutionfix8@gmail.com"
            className="hover:text-red-500 mx-2"
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
