"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { ThemeContext } from "../ThemeContext"; // تأكد من استيراد ThemeContext
import { FaEdit, FaTrash } from "react-icons/fa"; // استيراد أيقونات التعديل والحذف

interface User {
  id: number;
  username: string;
}

const Users: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext); // استخدام السياق لتحديد وضع السمة
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة لجلب المستخدمين
  const fetchUsers = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";

      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // إضافة التوكن في الهيدر
        },
      });

      setUsers(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "فشل في جلب المستخدمين");
      } else {
        setError("حدث خطأ غير معروف");
      }
    } finally {
      setLoading(false);
    }
  };

  // استخدام useEffect لجلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchUsers();
  }, []);

  // عرض التحميل أو الخطأ
  if (loading) {
    return <div>جاري جلب المستخدمين...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // دالة للتعامل مع حذف المستخدم
  const handleDeleteUser = async (userId: number) => {
    // هنا يمكنك تنفيذ طلب الحذف
    // يجب أن تضيف طلب حذف المستخدم هنا
    console.log(`حذف المستخدم برقم المعرف: ${userId}`);
  };

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">قائمة المستخدمين</h2>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">المعرف</th>
            <th className="py-2 px-4 border-b">اسم المستخدم</th>
            <th className="py-2 px-4 border-b">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button
                  onClick={() =>
                    console.log(`تعديل المستخدم برقم المعرف: ${user.id}`)
                  }
                >
                  <FaEdit className="text-blue-500 hover:text-blue-700" />
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>
                  <FaTrash className="text-red-500 hover:text-red-700" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
