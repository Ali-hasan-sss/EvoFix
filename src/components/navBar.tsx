"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/context/ThemeContext";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import "./assets/navbar.css";
import { FaList } from "react-icons/fa";
import Image from "next/image";
import EVOFIX from "./assets/images/EVOFIX.png";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
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

  const toggleMenu = () => {
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

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // أغلق القائمة إذا كان النقر خارجها
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      {/* Navbar for larger screens */}
      <nav
        className={`p-4 fixed w-full z-10 top-0 shadow-lg md:flex md:justify-between items-center border-b border-yellow-500 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-700 text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <button onClick={toggleTheme} className="p-2 mr-4 ">
            {isDarkMode ? "🌙" : "☀️"}
          </button>
          <Link href="/" className="logo">
            <Image
              src={EVOFIX}
              alt="logo"
              width={60}
              height={40}
              className="object-cover "
            />
          </Link>
          <button
            className="md:hidden text-white focus:outline-none ml-4"
            onClick={toggleMenu}
          >
            {isLoggedIn ? (
              <FaList className="text-2xl" />
            ) : (
              <span className="text-bold btn">التسجيل</span>
            )}
          </button>
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
              ) : userRole === "USER" ? (
                <Link
                  href="/dashboard"
                  className={`hover:text-gray-300 ${
                    activeItem === "dashboard" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleItemClick("dashboard")}
                >
                  لوحة التحكم
                </Link>
              ) : userRole === "TECHNICAL" ? (
                <Link
                  href="/dashboard"
                  className={`hover:text-gray-300 ${
                    activeItem === "dashboard" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleItemClick("technicaldashboard")}
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
      </nav>

      {/* Dropdown Menu for small screens m */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`md:hidden bg-blue-500 text-black border border-yellow-500 shadow-lg w-1/2 p-4 fixed left-2 top-20 z-50 rounded opacity-98 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-600"
          }`}
        >
          <ul className="space-y-4">
            {isLoggedIn ? (
              <li>
                {userRole === "ADMIN" ? (
                  <Link
                    href="/admindashboard"
                    className={`hover:text-gray-300 ${
                      activeItem === "dashboard" ? "text-yellow-400" : ""
                    }`}
                    onClick={() => handleItemClick("admindashboard")}
                  >
                    لوحة التحكم
                  </Link>
                ) : userRole === "TECHNICAL" ? (
                  <Link
                    href="/technicaldashboard"
                    className={`hover:text-gray-300 ${
                      activeItem === "dashboard" ? "text-yellow-400" : ""
                    }`}
                    onClick={() => handleItemClick("technicaldashboard")}
                  >
                    لوحة التحكم
                  </Link>
                ) : userRole === "USER" ? (
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
                  className="text-red-600 hover:text-red-500 text-light"
                >
                  تسجيل الخروج
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
