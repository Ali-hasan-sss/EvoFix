import React, { useState } from "react";
import {
  FaChevronUp,
  FaChevronDown,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

interface BottomNavbarProps {
  mainRow: Array<{
    key: string;
    name: string;
    icon: JSX.Element;
  }>;
  activeOption: string;
  handleOptionSelect: (option: string) => void;
  handleLogout: () => void;
  handleProfile?: () => void;
  isDarkMode: boolean;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  mainRow,
  activeOption,
  handleOptionSelect,
  handleLogout,
  handleProfile, // استدعاء دالة الملف الشخصي هنا
  isDarkMode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full md:hidden z-40 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-600 text-black"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex justify-center p-1 border-t border-yellow-500">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500"
          >
            {isCollapsed ? (
              <FaChevronUp className="text-2xl" />
            ) : (
              <FaChevronDown className="text-2xl" />
            )}
          </button>
        </div>

        {/* عرض الصف الأول بدون زر الملف الشخصي */}
        <div className="flex justify-around p-1 border-t border-yellow-500">
          {mainRow
            .filter((option) => option.key !== "profile") // استبعاد زر الملف الشخصي
            .map((option) => (
              <button
                key={option.key}
                onClick={() => handleOptionSelect(option.key)}
                className={`flex flex-col items-center flex-1 py-1 ${
                  activeOption === option.key ? "text-yellow-500" : "text-white"
                } transition-colors duration-200`}
                aria-label={option.name}
              >
                {option.icon}
                <span className="text-sm mt-1">{option.name}</span>
              </button>
            ))}
        </div>

        {/* عرض زر الملف الشخصي وزر تسجيل الخروج عند التوسع */}
        {!isCollapsed && (
          <div className="flex justify-around p-1 border-t border-yellow-500">
            {handleProfile && (
              <button
                onClick={handleProfile} // دالة الملف الشخصي
                className={`flex flex-col items-center  py-1 ${
                  activeOption === "profile" ? "text-yellow-500" : "text-white"
                } transition-colors duration-200`}
                aria-label="الملف الشخصي"
              >
                <FaUser className="text-2xl" />
                <span className="text-sm mt-1">الملف الشخصي</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-red-500 hover:text-red-700 transition-colors duration-200"
              aria-label="تسجيل الخروج"
            >
              <FaSignOutAlt className="text-2xl" />
              <span className="text-sm mt-1">خروج</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomNavbar;
