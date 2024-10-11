// components/dashboard/GenericTable.tsx

"use client";

import React, { useContext } from "react";
import { ThemeContext } from "@/app/ThemeContext";

// تعريف أنواع الأعمدة
interface ColumnWithAccessor {
  title: string;
  accessor: string;
}

interface ColumnWithRender {
  title: string;
  render: (item: any) => React.ReactNode;
}

type Column = ColumnWithAccessor | ColumnWithRender;

interface GenericTableProps {
  data: any[]; // بيانات الجدول
  columns: Column[]; // معلومات الأعمدة
}

const GenericTable: React.FC<GenericTableProps> = ({ data, columns }) => {
  const { isDarkMode } = useContext(ThemeContext); // استدعاء حالة الوضع الداكن

  // دالة للوصول إلى القيم المتداخلة
  const getValueByAccessor = (item: any, accessor: string) => {
    return accessor.split(".").reduce((obj, key) => obj?.[key], item) || "N/A";
  };

  return (
    <div className="overflow-x-auto">
      {/* تصميم الجدول التقليدي */}
      <div className="hidden md:block">
        <table
          className={`min-w-full border ${
            isDarkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-300"
          }`}
        >
          <thead>
            <tr
              className={`${
                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {columns.map((column, index) => (
                <th key={index} className="py-2 px-4 border-b text-center">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-2 px-4 border-b text-center ${
                        isDarkMode
                          ? "text-white border-gray-600"
                          : "text-black border-gray-300"
                      }`}
                    >
                      {"accessor" in column
                        ? getValueByAccessor(item, column.accessor)
                        : column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-2 text-center">
                  لا توجد بيانات لعرضها
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* تصميم البطاقات عند الشاشات الصغيرة */}
      <div className="block md:hidden">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item, rowIndex) => (
            <div
              key={rowIndex}
              className={`border p-4 mb-4 rounded-lg shadow-md ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="mb-2">
                  <strong>{column.title}:</strong>{" "}
                  <span>
                    {"accessor" in column
                      ? getValueByAccessor(item, column.accessor)
                      : column.render(item)}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-2">لا توجد بيانات لعرضها</div>
        )}
      </div>
    </div>
  );
};

export default GenericTable;
