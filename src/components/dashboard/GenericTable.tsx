"use client";

import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";

// Define columns based on having an accessor or render
interface ColumnWithAccessor<T> {
  title: string;
  accessor: keyof T; // Use keyof T to ensure it's a valid key of T
}

interface ColumnWithRender<T> {
  title: string;
  render: (item: T) => React.ReactNode;
}

export type Column<T> = ColumnWithAccessor<T> | ColumnWithRender<T>;

interface GenericTableProps<T> {
  data: T[]; // Data for the table
  columns: Column<T>[]; // Column information
  isLoading?: boolean; // Option to show loading state
}

// Generic Table component
const GenericTable = <T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false, // Default loading state
}: GenericTableProps<T>) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [sortedData, setSortedData] = useState<T[]>(data);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T; // Use keyof T here
    direction: "asc" | "desc";
  } | null>(null);
  useEffect(() => {
    setSortedData(data);
  }, [data]);
  // Function to get values based on accessor or render
  const getValueByAccessorOrRender = (
    column: Column<T>,
    item: T
  ): React.ReactNode => {
    // If the column has a render function
    if ("render" in column && typeof column.render === "function") {
      return column.render(item); // Call the function and return the result
    }

    // If the column has an accessor
    if ("accessor" in column && typeof column.accessor === "string") {
      const keys = column.accessor.split(".");
      let result: unknown = item;

      for (const key of keys) {
        if (
          result &&
          typeof result === "object" &&
          key in (result as Record<string, unknown>)
        ) {
          result = (result as Record<string, unknown>)[key];
        } else {
          return "N/A"; // If key is not found, return N/A
        }
      }

      if (
        result !== undefined &&
        (typeof result === "string" || typeof result === "number")
      ) {
        return result.toString();
      }
    }

    return "N/A"; // If no valid value is found
  };

  // Sorting function
  const handleSort = (accessor: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === accessor &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[accessor]; // Use keyof T
      const bValue = b[accessor]; // Use keyof T
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
    setSortConfig({ key: accessor, direction });
  };

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full border border-gray-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-lg shadow-lg`}
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
                onClick={() =>
                  "accessor" in column && handleSort(column.accessor)
                }
                className="py-3 px-6 border-b border-gray-300 text-center text-sm font-medium uppercase tracking-wider cursor-pointer"
              >
                {column.title}
                {"accessor" in column &&
                  sortConfig?.key === column.accessor &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-4 text-center">
                جارٍ التحميل...
              </td>
            </tr>
          ) : Array.isArray(sortedData) && sortedData.length > 0 ? (
            sortedData.map((item, rowIndex) => (
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
                    {getValueByAccessorOrRender(column, item)}
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
  );
};

export default GenericTable;
