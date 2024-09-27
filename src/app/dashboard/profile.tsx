// src/app/profile.tsx
"use client"; // تأكد من أن هذا المكون يعمل على العميل
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Profile: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  // جلب بيانات المستخدم
  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId"); // افترض أن لديك معرف المستخدم في localStorage
    if (userId) {
      try {
        const response = await axios.get(
          `https://evo-fix-api.vercel.app/api/users/${userId}`
        );
        setUserData(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // تحديث بيانات المستخدم
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`https://evo-fix-api.vercel.app/api/users/$11`, formData);
      setUserData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">بروفايل المستخدم</h1>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mt-4">
          <label>
            الاسم:
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2"
            />
          </label>
          <label>
            البريد الإلكتروني:
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border p-2"
            />
          </label>
          <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
            تحديث البيانات
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <p>الاسم: {userData.name}</p>
          <p>البريد الإلكتروني: {userData.email}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white p-2"
          >
            تعديل
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
