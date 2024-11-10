import React, { useEffect, useState } from "react";
import { useRepairRequests } from "@/app/context/RepairRequestsContext";
import { ClipLoader } from "react-spinners";
import { FaTrash } from "react-icons/fa";
import Switch from "react-switch";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

const Review: React.FC = () => {
  const { reviews = [], fetchReviews, isReviewsLoading } = useRepairRequests();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
    } catch (err) {
      console.error("خطأ أثناء تحديث الحالة:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/review/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("خطأ أثناء حذف التقييم:", err);
    }
  };

  if (isReviewsLoading)
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
    <div className="mt-5">
      <h2 className="text-xl text-center">التقييمات</h2>

      {reviews.length === 0 ? (
        <p>لا توجد تقييمات.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li
              key={review.id}
              className="mb-4 border-b pb-2 flex items-center justify-between"
            >
              <div>
                <h3>{review.user.fullName}</h3>
                <p>البريد الإلكتروني: {review.user.email}</p>
                <p>رقم الهاتف: {review.user.phoneNO}</p>
                <p>تقييم: {review.rating}</p>
                <p>{review.comment}</p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="ml-4">
                  <Switch
                    checked={review.isActive}
                    onChange={() => handleToggleActive(review.id)}
                    onColor="#86d3ff"
                    offColor="#ccc"
                    width={40}
                    height={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                  />
                </label>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Review;
