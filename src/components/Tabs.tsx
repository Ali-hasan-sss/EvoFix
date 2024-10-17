import React, { useContext } from "react";
import { ThemeContext } from "@/app/ThemeContext";

interface Tab {
  label: string;
  key: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div>
      {/* Select Dropdown for Mobile */}
      <div className="sm:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
          className={`w-full py-2 px-4 rounded focus:outline-none transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs for Desktop */}
      <div className="hidden sm:flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`py-2 px-4 mx-4 rounded focus:outline-none transition-colors duration-300 ${
              activeTab === tab.key
                ? isDarkMode
                  ? "bg-blue-700 text-white"
                  : "bg-blue-500 text-white"
                : isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
