import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "react-switch";
import { API_BASE_URL } from "@/utils/api";
import { ClipLoader } from "react-spinners";

// تعريف نوع المراجعة لتحديد شكل البيانات القادمة من الـ API
interface Review {
  id: number;
  reviewerName: string;
  rating: number; // يمكن تغييره إلى string إذا كانت النجوم تستخدم كالتقييم
  comment: string;
  isActive: boolean;
}

const Review: React.FC = () => {
  // حالات خاصة بالبيانات
  const [reviews, setReviews] = useState<Review[]>([]); // حفظ التقييمات
  const [loading, setLoading] = useState<boolean>(true); // حالة التحميل
  const [error, setError] = useState<string | null>(null); // حالة الخطأ

  // جلب التقييمات عند تحميل المكون
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/review`);
        setReviews(response.data); // تعيين البيانات المجلوبة للتقييمات
      } catch (err) {
        setError("حدث خطأ أثناء جلب التقييمات."); // حفظ رسالة الخطأ في حال حدوث مشكلة
      } finally {
        setLoading(false); // إنهاء التحميل
      }
    };

    fetchReviews(); // استدعاء الدالة
  }, []);

  // التعامل مع تبديل حالة التفعيل للمراجعة
  const handleToggleActive = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/review/${id}`, { isActive: true }); // تحديث حالة التفعيل في الخادم
      setReviews((prevReviews) =>
        prevReviews.map(
          (review) =>
            review.id === id ? { ...review, isActive: true } : review // تحديث الحالة محليًا
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
      {/* عرض رسالة في حال عدم وجود تقييمات */}
      {reviews.length === 0 ? (
        <p>لا توجد تقييمات.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="mb-4 border-b pb-2">
              <h3>{review.reviewerName}</h3>
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
