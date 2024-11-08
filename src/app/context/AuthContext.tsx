"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// Define the AuthContextType interface for user authentication state and functions
interface AuthContextType {
  isLoggedIn: boolean; // Determines if the user is logged in
  userId: string | null; // Stores the user ID if logged in, null otherwise
  email: string | null; // Stores the user's email if logged in, null otherwise
  login: (email: string, userId: string) => void; // Login function with email and userId parameters
  logout: () => void; // Logout function to clear user data and redirect
}

// Create AuthContext with default values for the authentication state
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  email: null,
  login: () => {},
  logout: () => {},
});

// AuthProvider component to manage and provide the authentication state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks if the user is logged in
  const [userId, setUserId] = useState<string | null>(null); // Stores the user ID
  const [email, setEmail] = useState<string | null>(null); // Stores the user's email
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Retrieve stored user data and token when the component mounts
    const savedEmail = localStorage.getItem("email"); // Get email from local storage
    const savedUserId = localStorage.getItem("userId"); // Get user ID from local storage
    const token = Cookies.get("token"); // Get authentication token from cookies

    // If token and user data exist, set them in the state to keep user logged in
    if (token && savedEmail && savedUserId) {
      setEmail(savedEmail);
      setUserId(savedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  // Function to log the user in and store data locally
  const login = (email: string, userId: string) => {
    setEmail(email); // Set email in state
    setUserId(userId); // Set user ID in state
    setIsLoggedIn(true); // Set logged-in state to true
    localStorage.setItem("email", email); // Store email in local storage
    localStorage.setItem("userId", userId); // Store user ID in local storage
  };

  // Function to log the user out, clear data, and redirect
  const logout = () => {
    Cookies.remove("token"); // Remove authentication token from cookies
    localStorage.removeItem("email"); // Remove email from local storage
    localStorage.removeItem("userId"); // Remove user ID from local storage
    localStorage.removeItem("userRole"); // Remove user role from local storage if present

    setEmail(null); // Clear email in state
    setUserId(null); // Clear user ID in state
    setIsLoggedIn(false); // Set logged-in state to false

    // Display success message and redirect to the home page after a delay
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  // Provide the authentication state and functions to child components
  return (
    <AuthContext.Provider value={{ isLoggedIn, email, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
