// src/context/AuthContext.tsx
"use client"; // تأكد من أن هذا المكون يعمل على العميل

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, userId: string) => {
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);

    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axios.post(
          "https://evo-fix-api.vercel.app/api/users/logout",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("email");
          localStorage.removeItem("userId");
          setIsLoggedIn(false);
          toast.success("تم تسجيل الخروج بنجاح!");
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        } else {
          toast.error("فشل في تسجيل الخروج. حاول مرة أخرى.");
        }
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج. حاول مرة أخرى.");
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
