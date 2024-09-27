import React from "react";

interface GenericTableProps {
  data: any[]; // بيانات الجدول
  columns: { title: string; accessor: string }[]; // معلومات الأعمدة
}

const GenericTable: React.FC<GenericTableProps> = ({ data, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((column, index) => (
              <th key={index} className="py-2 px-4 border-b text-center">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="py-2 px-4 border-b text-center">
                  {item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
