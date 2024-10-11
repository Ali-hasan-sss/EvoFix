"use client";

import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/ThemeContext";
import { usePathname } from "next/navigation"; // استيراد usePathname
import { toast } from "react-toastify";
import "./assets/navbar.css";
const Navbar: React.FC = () => {
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout } = useContext(AuthContext); // استخدام isLoggedIn و logout من AuthContext
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname(); // استخدام usePathname بدلاً من useRouter

  // قراءة دور المستخدم من localStorage عند تحميل المكون
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  // تحديث العنصر النشط بناءً على المسار الحالي
  useEffect(() => {
    const path = pathname;
    if (path === "/") {
      setActiveItem("home");
    } else if (path === "/about") {
      setActiveItem("about");
    } else if (path === "/services") {
      setActiveItem("services");
    } else if (path === "/dashboard" || path === "/admin-dashboard") {
      setActiveItem("dashboard");
    } else if (path === "/login") {
      setActiveItem("login");
    } else if (path === "/register") {
      setActiveItem("register");
    } else if (path === "/joinus") {
      setActiveItem("joinus");
    } else {
      setActiveItem("");
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح!");
    window.location.href = "/";
  };

  return (
    <div>
      <nav
        className={`p-4 fixed w-full z-10 top-0 shadow-lg md:flex md:justify-between ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-blue-500 text-black"
        }`}
      >
        <div className="flex justify-between items-center">
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
            <Link
              href="/"
              className={`hover:text-gray-300 ${
                activeItem === "home" ? "text-yellow-400" : ""
              }`}
              onClick={() => handleItemClick("home")}
            >
              الرئيسية
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`hover:text-gray-300 ${
                activeItem === "about" ? "text-yellow-400" : ""
              }`}
              onClick={() => handleItemClick("about")}
            >
              عننا
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className={`hover:text-gray-300 ${
                activeItem === "services" ? "text-yellow-400" : ""
              }`}
              onClick={() => handleItemClick("services")}
            >
              الخدمات
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              {userRole === "ADMIN" || userRole === "SUBADMIN" ? (
                <Link
                  href="/admindashboard"
                  className={`hover:text-gray-300 ${
                    activeItem === "dashboard" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleItemClick("dashboard")}
                >
                  لوحة التحكم
                </Link>
              ) : userRole === "USER" || userRole === "TECHNICAL" ? (
                <Link
                  href="/dashboard"
                  className={`hover:text-gray-300 ${
                    activeItem === "dashboard" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleItemClick("dashboard")}
                >
                  لوحة التحكم
                </Link>
              ) : null}
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className={`hover:text-gray-300 ${
                    activeItem === "login" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleItemClick("login")}
                >
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`hover:text-gray-300 ${
                    activeItem === "register" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleItemClick("register")}
                >
                  إنشاء حساب
                </Link>
              </li>
              <li>
                <Link
                  href="/joinus"
                  className={`hover:text-gray-300 ${
                    activeItem === "joinus" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleItemClick("joinus")}
                >
                  انضم الينا
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 text-light"
              >
                تسجيل الخروج
              </button>
            </li>
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
              <Link
                href="/"
                className={`block text-white ${
                  activeItem === "home" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleItemClick("home")}
              >
                الرئيسية
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`block text-light-700 ${
                  activeItem === "about" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleItemClick("about")}
              >
                عننا
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className={`block text-light-700 ${
                  activeItem === "services" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleItemClick("services")}
              >
                الخدمات
              </Link>
            </li>
            {isLoggedIn && userRole ? (
              <li>
                {userRole === "ADMIN" || userRole === "SUBADMIN" ? (
                  <Link
                    href="/admindashboard"
                    className={`hover:text-gray-300 ${
                      activeItem === "dashboard" ? "text-yellow-400" : ""
                    }`}
                    onClick={() => handleItemClick("dashboard")}
                  >
                    لوحة التحكم
                  </Link>
                ) : userRole === "USER" || userRole === "TECHNICAL" ? (
                  <Link
                    href="/dashboard"
                    className={`hover:text-gray-300 ${
                      activeItem === "dashboard" ? "text-yellow-400" : ""
                    }`}
                    onClick={() => handleItemClick("dashboard")}
                  >
                    لوحة التحكم
                  </Link>
                ) : null}
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className={`hover:text-gray-300 ${
                      activeItem === "login" ? "text-yellow-400" : ""
                    }`}
                    onClick={() => handleItemClick("login")}
                  >
                    تسجيل الدخول
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className={`hover:text-gray-300 ${
                      activeItem === "register" ? "text-yellow-400" : ""
                    }`}
                    onClick={() => handleItemClick("register")}
                  >
                    إنشاء حساب
                  </Link>
                </li>
                <li>
                  <Link
                    href="/joinus"
                    className={`hover:text-gray-300 ${
                      activeItem === "joinus" ? "text-yellow-400" : ""
                    }`}
                    onClick={() => handleItemClick("joinus")}
                  >
                    انضم الينا
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
