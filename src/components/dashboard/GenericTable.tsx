"use client";

import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";

interface ColumnWithAccessor<T> {
  title: string;
  accessor: keyof T;
}

interface ColumnWithRender<T> {
  title: string;
  render: (item: T) => React.ReactNode;
}

export type Column<T> = ColumnWithAccessor<T> | ColumnWithRender<T>;

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
}

const GenericTable = <T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
}: GenericTableProps<T>) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [sortedData, setSortedData] = useState<T[]>(data);
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const filteredData = data.filter((item) =>
      columns.some((column) =>
        "accessor" in column && typeof column.accessor === "string"
          ? (item[column.accessor] as string)
              ?.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          : false
      )
    );
    setSortedData(filteredData);
  }, [data, searchValue, columns]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const getValueByAccessorOrRender = (
    column: Column<T>,
    item: T
  ): React.ReactNode => {
    if ("render" in column && typeof column.render === "function") {
      return column.render(item);
    }

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
          return "N/A";
        }
      }

      if (
        result !== undefined &&
        (typeof result === "string" || typeof result === "number")
      ) {
        return result.toString();
      }
    }

    return "N/A";
  };

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
      const aValue = a[accessor];
      const bValue = b[accessor];
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
    setSortConfig({ key: accessor, direction });
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-start">
        <input
          type="text"
          placeholder="بحث بالاسم..."
          value={searchValue}
          onChange={handleSearchChange}
          className={`p-2 border rounded-lg outline-none  ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-gray-200 text-black border-gray-300"
          }`}
        />
      </div>
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
          ) : sortedData.length > 0 ? (
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
                } hover:bg-gray-500 transition-colors`}
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
