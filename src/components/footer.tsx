import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaXRay,
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
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaTwitter />
          </a>
          <a href="mailto:example@example.com" className="hover:text-red-500">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
