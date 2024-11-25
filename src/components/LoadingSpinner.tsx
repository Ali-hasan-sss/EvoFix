"use client";

import React, { useContext } from "react";
import Image from "next/image";
import spinner from "@/components/assets/images/spiner.png";
import { ThemeContext } from "@/app/context/ThemeContext";

const LoadingSpinner: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`flex items-center justify-center h-screen spinner-container
       ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}
    `}
    >
      <div className="flex items-center justify-center h-screen relative">
        {/* التروس */}
        <div className="relative">
          <Image
            src={spinner}
            alt="ترس كبير"
            width={120}
            height={120}
            className="animate-spin-clockwise"
          />
          <Image
            src={spinner}
            alt="ترس صغير"
            width={60}
            height={60}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-counterclockwise"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
