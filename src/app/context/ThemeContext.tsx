"use client";

import React, { createContext, useState, useEffect } from "react";

// Define the type for the theme context, specifying dark mode state and a function to toggle it
interface ThemeContextType {
  isDarkMode: boolean; // Boolean to track if dark mode is enabled
  toggleTheme: () => void; // Function to toggle between dark and light modes
}

// Create the ThemeContext with default values for initial setup
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// ThemeProvider component to manage and provide theme state to child components
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to keep track of whether dark mode is enabled
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the theme mode from localStorage on initial render to persist the user's choice
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode"); // Retrieve stored theme preference
    if (storedMode) {
      setIsDarkMode(storedMode === "true"); // Update state if a preference is stored
    }
  }, []);

  // Toggle theme function to switch between dark and light modes
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      localStorage.setItem("darkMode", (!prevMode).toString()); // Update localStorage with the new mode
      return !prevMode; // Update the state to the opposite mode
    });
  };

  // Provide the isDarkMode state and toggleTheme function to child components via context
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
