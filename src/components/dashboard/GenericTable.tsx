"use client";

import React, { useContext } from "react";
import { ThemeContext } from "@/app/ThemeContext";

interface ColumnWithAccessor {
  title: string;
  accessor: string;
}

interface ColumnWithRender<T> {
  title: string;
  render: (item: T) => React.ReactNode;
}

type Column<T> = ColumnWithAccessor | ColumnWithRender<T>;

interface GenericTableProps<T> {
  data: T[]; // بيانات الجدول
  columns: Column<T>[]; // معلومات الأعمدة
}

const GenericTable = <T extends Record<string, unknown>>({
  data,
  columns,
}: GenericTableProps<T>) => {
  const { isDarkMode } = useContext(ThemeContext);

  const getValueByAccessor = (item: T, accessor: string): string => {
    const result = accessor
      .split(".")
      .reduce((prev: Record<string, unknown> | undefined, key: string) => {
        if (prev && typeof prev === "object" && key in prev) {
          return prev[key] as Record<string, unknown> | undefined;
        }
        return undefined;
      }, item);

    if (typeof result === "string") {
      return result;
    }

    return "N/A";
  };

  return (
    <div className="overflow-x-auto">
      {/* تصميم الجدول التقليدي */}
      <div className="hidden md:block">
        <table
          className={`min-w-full border border-gray-300 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg overflow-hidden`}
        >
          <thead>
            <tr
              className={`${
                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-3 px-6 border-b border-gray-300 text-center text-sm font-medium uppercase tracking-wider"
                >
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
                  className={`${
                    rowIndex % 2 === 0
                      ? isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-50"
                      : isDarkMode
                      ? "bg-gray-600"
                      : "bg-white"
                  } hover:bg-gray-300 transition-colors`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-4 px-6 border-b border-gray-300 text-center text-sm ${
                        isDarkMode ? "text-white" : "text-gray-800"
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
                <td
                  colSpan={columns.length}
                  className="py-4 text-center text-sm text-gray-500"
                >
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
              className={`border border-gray-300 rounded-lg shadow-md p-4 mb-4 ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
              } transition-transform transform hover:scale-105`}
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="mb-2">
                  <span className="font-semibold">{column.title}:</span>{" "}
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
          <div className="text-center py-4 text-sm text-gray-500">
            لا توجد بيانات لعرضها
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericTable;
