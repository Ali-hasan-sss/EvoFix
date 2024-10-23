import React, { useState } from "react";
import { FaChevronUp, FaChevronDown, FaSignOutAlt } from "react-icons/fa";

interface BottomNavbarProps {
  mainRow: Array<{
    key: string;
    name: string;
    icon: JSX.Element;
  }>;
  activeOption: string;
  handleOptionSelect: (option: string) => void;
  handleLogout: () => void;
  isDarkMode: boolean;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  mainRow,
  activeOption,
  handleOptionSelect,
  handleLogout,
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
        <div className="flex justify-center p-1 border-t border-gray-300">
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
        <div className="flex justify-around p-1 border-t border-gray-300">
          {mainRow.map((option) => (
            <button
              key={option.key}
              onClick={() => handleOptionSelect(option.key)}
              className={`flex flex-col items-center flex-1 py-1 ${
                activeOption === option.key ? "text-yellow-800" : "text-white"
              } transition-colors duration-200`}
              aria-label={option.name}
            >
              {option.icon}
              <span className="text-sm mt-1">{option.name}</span>
            </button>
          ))}
        </div>

        {!isCollapsed && (
          <div className="flex justify-center p-1 border-t border-gray-300">
            <button
              onClick={handleLogout}
              className={`flex flex-col items-center text-red-500 hover:text-red-700 transition-colors duration-200`}
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
