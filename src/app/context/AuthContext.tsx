"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
  login: (email: string, userId: string) => void; // حذف token من هنا
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  email: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // جلب بيانات المستخدم المخزنة عند التحميل الأول
    const savedEmail = localStorage.getItem("email");
    const savedUserId = localStorage.getItem("userId");
    const token = Cookies.get("token"); // جلب التوكن من الكوكيز

    if (token && savedEmail && savedUserId) {
      setEmail(savedEmail);
      setUserId(savedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, userId: string) => {
    setEmail(email);
    setUserId(userId);
    setIsLoggedIn(true);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);
    // لا حاجة لإعداد الكوكيز هنا لأن التوكن يتم تعيينه من خلال الباكيند
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");

    setEmail(null);
    setUserId(null);
    setIsLoggedIn(false);

    toast.success("تم تسجيل الخروج بنجاح!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
