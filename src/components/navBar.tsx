"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/context/ThemeContext";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { FaList, FaMoon, FaSun } from "react-icons/fa";
import Image from "next/image";
import EVOFIX from "./assets/images/EVOFIX.png";
import {
  fetchNotificationsCount,
  startNotificationsCount,
} from "@/utils/notification-count";
import { FiSun } from "react-icons/fi";
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

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await fetchNotificationsCount();
        setNotificationsCount(count);
      } catch (error) {
        console.error("Error fetching notifications count:", error);
      }
    };
    fetchCount();
  }, []);
  useEffect(() => {
    // بدء التحديث التلقائي
    const stopPolling = startNotificationsCount(setNotificationsCount);

    // تنظيف عند إزالة المكون
    return () => stopPolling();
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
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

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
        className={`p-4 fixed w-full z-50 top-0 md:flex md:justify-between items-center navbar   ${
          isDarkMode
            ? "text-white shadow-custom-dark "
            : "text-black shadow-custom-light"
        }`}
      >
        <div className="flex justify-between items-center">
          <button onClick={toggleTheme} className="p-2 mr-4 ">
            {isDarkMode ? <FaMoon /> : <FiSun className="text-blue-400" />}
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
              //////////////////////////////////////

              <div className="relative ">
                <FaList
                  className={`text-2xl ${
                    isDarkMode ? "text-white" : "-blue-400"
                  }`}
                />
                {notificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                    {notificationsCount}
                  </span>
                )}
              </div>
            ) : (
              <span className="flex items-center gap-2 text-bold">
                <FaList
                  className={`text-2xl ${
                    isDarkMode ? "text-white" : "text-blue-400"
                  }`}
                />
              </span>
            )}
          </button>
        </div>
        <ul className="hidden md:flex ">
          <li>
            <Link
              href="/"
              className={`nav-item ${activeItem === "home" ? "active" : ""}`}
              onClick={() => handleItemClick("home")}
            >
              الرئيسية
            </Link>
          </li>
          <li>
            <Link
              href="/#about"
              className={`nav-item ${activeItem === "about" ? "active" : ""}`}
              onClick={() => handleItemClick("about")}
            >
              من نحن
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className={`nav-item ${
                activeItem === "services" ? "active" : ""
              }`}
              onClick={() => handleItemClick("services")}
            >
              الخدمات
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                {userRole === "ADMIN" || userRole === "SUBADMIN" ? (
                  <div className="relative">
                    {notificationsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                        {notificationsCount}
                      </span>
                    )}
                    <Link
                      href="/admindashboard"
                      className={`nav-item ${
                        activeItem === "dashboard" ? "active" : ""
                      }`}
                      onClick={() => handleItemClick("dashboard")}
                    >
                      لوحة التحكم
                    </Link>
                  </div>
                ) : userRole === "USER" ? (
                  <div className="relative">
                    {notificationsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                        {notificationsCount}
                      </span>
                    )}
                    <Link
                      href="/dashboard"
                      className={`nav-item ${
                        activeItem === "dashboard" ? "active" : ""
                      }`}
                      onClick={() => handleItemClick("dashboard")}
                    >
                      لوحة التحكم
                    </Link>
                  </div>
                ) : userRole === "TECHNICAL" ? (
                  <div className="relative">
                    {notificationsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                        {notificationsCount}
                      </span>
                    )}
                    <Link
                      href="/technicaldashboard"
                      className={`hover:text-gray-300 ${
                        activeItem === "dashboard" ? "text-yellow-400" : ""
                      }`}
                      onClick={() => handleItemClick("technicaldashboard")}
                    >
                      لوحة التحكم
                    </Link>
                  </div>
                ) : null}
              </li>

              <button
                onClick={handleLogout}
                className="  text-red-500 hover:text-red-700 rounded p-2 transition-colors duration-200"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className={`nav-item  ${
                    activeItem === "login" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("login")}
                >
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`nav-item ${
                    activeItem === "register" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("register")}
                >
                  إنشاء حساب
                </Link>
              </li>
              <li>
                <Link
                  href="/joinus"
                  className={`nav-item ${
                    activeItem === "joinus" ? "active" : ""
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
          className={`md:hidden menu  w-1/2 p-4 fixed left-1 top-20 z-50 rounded  ${
            isDarkMode
              ? "text-white shadow-dark border-dark"
              : "text-black shadow-light border-light"
          }`}
        >
          <ul className="space-y-4">
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/"
                    className={`nav-item ${
                      activeItem === "home" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("home")}
                  >
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className={`nav-item ${
                      activeItem === "about" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("about")}
                  >
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className={`nav-item ${
                      activeItem === "services" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("services")}
                  >
                    الخدمات
                  </Link>
                </li>
                <li>
                  {userRole === "ADMIN" ? (
                    <Link
                      href="/admindashboard"
                      className={`nav-item ${
                        activeItem === "dashboard" ? "text-yellow-400" : ""
                      }`}
                      onClick={() => handleItemClick("admindashboard")}
                    >
                      لوحة التحكم
                    </Link>
                  ) : userRole === "TECHNICAL" ? (
                    <Link
                      href="/technicaldashboard"
                      className={`nav-item ${
                        activeItem === "dashboard" ? "text-yellow-400" : ""
                      }`}
                      onClick={() => handleItemClick("technicaldashboard")}
                    >
                      لوحة التحكم
                    </Link>
                  ) : userRole === "USER" ? (
                    <Link
                      href="/dashboard"
                      className={`nav-item ${
                        activeItem === "dashboard" ? "text-yellow-400" : ""
                      }`}
                      onClick={() => handleItemClick("dashboard")}
                    >
                      لوحة التحكم
                    </Link>
                  ) : null}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/"
                    className={`nav-item ${
                      activeItem === "home" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("home")}
                  >
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className={`nav-item ${
                      activeItem === "about" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("about")}
                  >
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className={`nav-item ${
                      activeItem === "services" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("services")}
                  >
                    الخدمات
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className={`nav-item ${
                      activeItem === "login" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("login")}
                  >
                    تسجيل الدخول
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className={`nav-item ${
                      activeItem === "register" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("register")}
                  >
                    إنشاء حساب
                  </Link>
                </li>
                <li>
                  <Link
                    href="/joinus"
                    className={`nav-item  ${
                      activeItem === "joinus" ? "active" : ""
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
                  className="text-red-600 hover:text-red-500 "
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
