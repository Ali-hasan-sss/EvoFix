import React, { useEffect, useState } from "react";
import { useRepairRequests } from "@/app/context/adminData";
import { ClipLoader } from "react-spinners";
import { FaTrash } from "react-icons/fa";
import Switch from "react-switch";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { API_BASE_URL } from "@/utils/api";

const Review: React.FC = () => {
  const {
    reviews: contextReviews = [],
    fetchReviews,
    isReviewsLoading,
  } = useRepairRequests();
  const [reviews, setReviews] = useState(contextReviews);

  useEffect(() => {
    setReviews(contextReviews);
  }, [contextReviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const token = Cookies.get("token");
      const updatedIsActive = !isActive;

      await axios.put(
        `${API_BASE_URL}/review/${id}`,
        { isActive: updatedIsActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تحديث حالة النشاط محليًا
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, isActive: updatedIsActive } : review
        )
      );
      toast.success("تم تحديث حالة النشر!");
    } catch (err) {
      console.error("خطأ أثناء تحديث الحالة:", err);
      toast.error("حدث خطأ أثناء تحديث الحالة.");
    }
  };

  const confirmDeleteReview = (id: number) => {
    confirmAlert({
      title: "تاكيد الحذف",
      message: "هل انت متاكد من حذف التقييم ؟",
      buttons: [
        {
          label: "نعم",
          onClick: () => handleDelete(id),
        },
        {
          label: "لا",
        },
      ],
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/review/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // تحديث المراجعات محليًا في الواجهة وفي السياق
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );

      // تحديث قائمة المراجعات في السياق لجلب البيانات الجديدة من السيرفر
      await fetchReviews();

      toast.success("تم حذف التقييم بنجاح!");
    } catch (err) {
      console.error("خطأ أثناء حذف التقييم:", err);
      toast.error("حدث خطأ أثناء الحذف.");
    }
  };

  if (isReviewsLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
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
                    onChange={() =>
                      handleToggleActive(review.id, review.isActive)
                    }
                    onColor="#86d3ff"
                    offColor="#ccc"
                    width={40}
                    height={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                  />
                </label>
                <button
                  onClick={() => confirmDeleteReview(review.id)}
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
