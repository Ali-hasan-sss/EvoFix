// src/components/Review.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "react-switch";
import { API_BASE_URL } from "@/utils/api";
import { ClipLoader } from "react-spinners";

interface Review {
  id: number;
  reviewerName: string;
  rating: number; // يمكن استخدام string إذا كنت تستخدم نجوم لتقييم
  comment: string;
  isActive: boolean;
}

const Review: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/review`);
        setReviews(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب التقييمات.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleToggleActive = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/review/${id}`, { isActive: true });
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, isActive: true } : review
        )
      );
    } catch (err) {
      console.error("خطأ أثناء تحديث الحالة:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-96">
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <h2>التقييمات</h2>
      {reviews.length === 0 ? (
        <p>لا توجد تقييمات.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
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
