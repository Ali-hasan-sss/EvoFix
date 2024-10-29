import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "react-switch";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
import { ClipLoader } from "react-spinners";

// تعريف نوع المراجعة لتحديد شكل البيانات القادمة من الـ API
interface Review {
  id: number;
  rating: number;
  comment: string;
  isActive: boolean;
  user: {
    fullName: string;
    email: string;
    phoneNO: string;
  };
}

const Review: React.FC = () => {
  // حالات خاصة بالبيانات
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // جلب التقييمات عند تحميل المكون
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${API_BASE_URL}/review`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setReviews(
          Array.isArray(response.data.adminReviews)
            ? response.data.adminReviews
            : []
        );
      } catch (err) {
        setError("حدث خطأ أثناء جلب التقييمات.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // التعامل مع تبديل حالة التفعيل للمراجعة
  const handleToggleActive = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await axios.put(
        `${API_BASE_URL}/review/${id}`,
        { isActive: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, isActive: true } : review
        )
      );
    } catch (err) {
      console.error("خطأ أثناء تحديث الحالة:", err);
    }
  };

  // عرض مؤشر التحميل أثناء انتظار البيانات
  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );

  // عرض رسالة خطأ عند حدوث مشكلة في جلب البيانات
  if (error)
    return (
      <div className="flex justify-center items-center h-96">
        <p>{error}</p>
      </div>
    );

  // العرض الأساسي للمكون
  return (
    <div>
      <h2>التقييمات</h2>
      {reviews.length === 0 ? (
        <p>لا توجد تقييمات.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="mb-4 border-b pb-2">
              <h3>{review.user.fullName}</h3>
              <p>البريد الإلكتروني: {review.user.email}</p>
              <p>رقم الهاتف: {review.user.phoneNO}</p>
              <p>تقييم: {review.rating}</p>
              <p>{review.comment}</p>
              <label>
                <Switch
                  checked={review.isActive}
                  onChange={() => handleToggleActive(review.id)}
                  onColor="#86d3ff"
                  offColor="#ccc"
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
                {review.isActive ? "مفعل" : "غير مفعل"}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Review;
