import React, { useEffect, useState } from "react";
import axios from "axios"; // استيراد Axios
import { API_BASE_URL } from "../../utils/api"; // تأكد من استيراد API_BASE_URL بشكل صحيح

interface UserDetailProps {
  userId: number; // معرف المستخدم
}

interface User {
  id: number;
  name: string;
  email: string;
  // يمكنك إضافة المزيد من الحقول حسب الحاجة
}

const UserDetail: React.FC<UserDetailProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));
        const authToken = token ? token.split("=")[1] : "";

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError("فشل في جلب بيانات المستخدم");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>جاري جلب بيانات المستخدم...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 border rounded-md bg-gray-200">
      <h3 className="text-xl font-semibold">تفاصيل المستخدم</h3>
      {user && (
        <>
          <p>
            <strong>الاسم:</strong> {user.name}
          </p>
          <p>
            <strong>البريد الإلكتروني:</strong> {user.email}
          </p>
          {/* يمكنك إضافة المزيد من التفاصيل حسب الحاجة */}
        </>
      )}
    </div>
  );
};

export default UserDetail;
