import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/ThemeContext";
import "././assats/navbar.css";
const Navbar: React.FC = () => {
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout } = useContext(AuthContext); // استخدام isLoggedIn و logout من AuthContext
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  // هذا الـ useEffect للتأكد من أن activeItem يعيد التعيين عندما يتغير isLoggedIn
  useEffect(() => {
    if (!isLoggedIn) {
      setActiveItem(""); // أو أي حالة افتراضية تريدها
    }
  }, [isLoggedIn]);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  return (
    <div>
      <nav
        className={`p-4 fixed w-full z-10 top-0 shadow-lg md:flex md:justify-between ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        }`}
      >
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold">EVOFIX</h1>
          <div className="flex items-center">
            <button onClick={toggleTheme} className="p-2 mr-5">
              {isDarkMode ? "🌙" : "☀️"}
            </button>
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul className="hidden md:flex space-x-4">
          <li>
            <a
              href="/"
              className={`hover:text-gray-300 ${
                activeItem === "home" ? "text-yellow-400" : ""
              }`}
              onClick={() => handleItemClick("home")}
            >
              الرئيسية
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`hover:text-gray-300 ${
                activeItem === "about" ? "text-yellow-400" : ""
              }`}
              onClick={() => handleItemClick("about")}
            >
              عننا
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`hover:text-gray-300 ${
                activeItem === "services" ? "text-yellow-400" : ""
              }`}
              onClick={() => handleItemClick("services")}
            >
              الخدمات
            </a>
          </li>
          {isLoggedIn ? (
            <li>
              <a href="/dashboard" className="hover:text-gray-300 text-light">
                لوحة التحكم
              </a>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-gray-300 text-light">
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-gray-300 text-light"
                >
                  انشاء حساب
                </Link>
              </li>
              <li>
                <Link href="/joinus" className="hover:text-gray-300 text-light">
                  انضم الينا
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 right-0 bg-gray-800 bg-opacity-75 z-20 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div
          className={
            isDarkMode
              ? "bg-gray-800 text-white h-full w-64 p-4 shadow-lg"
              : "bg-blue-500 text-black h-full w-64 p-4 shadow-lg"
          }
        >
          <button
            className={"text-light focus:outline-none mb-4"}
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <ul className="space-y-6">
            <li>
              <a
                href="#"
                className={`block text-white  ${
                  activeItem === "home" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleItemClick("home")}
              >
                الرئيسية
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block text-light-700 ${
                  activeItem === "about" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleItemClick("about")}
              >
                عننا
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block text-light-700 ${
                  activeItem === "services" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleItemClick("services")}
              >
                الخدمات
              </a>
            </li>
            {isLoggedIn ? (
              <li>
                <a href="/dashboard" className="hover:text-gray-300 text-light">
                  لوحة التحكم
                </a>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-light text-light p-2"
                  >
                    تسجيل الدخول
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-light-300 text-light p-2"
                  >
                    انشاء حساب
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
