import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPaperPlane, FaStar } from "react-icons/fa";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../app/context/ThemeContext";
import Slider from "react-slick";

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    fullName: string;
  };
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  // جلب التقييمات من API
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/review`);
      setReviews(
        Array.isArray(response.data.allReviews) ? response.data.allReviews : []
      );
    } catch (error) {
      console.error("فشل في جلب التقييمات:", error);
      toast.error("حدث خطأ أثناء جلب التقييمات.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // التحقق من تسجيل الدخول
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      toast.error("يجب تسجيل الدخول لإضافة تقييم.");
      return;
    }

    if (!rating || !comment) {
      toast.error("يرجى تعبئة كل من التقييم والتعليق.");
      return;
    }

    setIsLoading(true);

    const token = Cookies.get("token");

    try {
      await axios.post(
        `${API_BASE_URL}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تم إضافة التقييم بنجاح!");
      // إعادة تعيين الحقول
      setRating(0);
      setHover(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("فشل في إضافة التقييم:", error);
      toast.error("حدث خطأ أثناء محاولة إضافة التقييم.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-xl mx-auto p-4 rounded`}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        تقييمات المستخدمين
      </h2>

      {/* عرض التقييمات ضمن سلايدر */}
      <div className="mb-6">
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <Slider {...settings}>
            {reviews.map((review) => (
              <div key={review.id} className="mb-4 border-b pb-2">
                <details>
                  <summary className="cursor-pointer font-semibold">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p>{review.user.fullName}</p>
                  </summary>
                  <p className="mt-2">{review.comment}</p>
                </details>
              </div>
            ))}
          </Slider>
        ) : (
          <p>لا توجد تقييمات بعد.</p>
        )}
      </div>

      {/* إضافة تقييم جديد */}
      <form
        onSubmit={handleSubmitReview}
        className={`p-4 rounded ${
          isDarkMode ? "shadow-dark " : "shadow-light "
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">أضف تقييمك</h3>

        {/* اختيار التقييم بنجوم */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={24}
              className={
                i < (hover || rating)
                  ? "text-yellow-500 cursor-pointer"
                  : "text-gray-500 cursor-pointer"
              }
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(rating)}
            />
          ))}
        </div>

        {/* حقل إدخال التعليق */}
        <div className="mb-4 relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded pr-10 text-black"
            rows={3}
            placeholder="اكتب تعليقك هنا...."
            required
          />
          <button
            type="submit"
            className="absolute left-2 top-5 text-blue-500 hover:text-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin rounded-full border-2 border-t-blue-500 border-blue-300 h-5 w-5"></span>
                <span>جاري الإرسال...</span>
              </div>
            ) : (
              <FaPaperPlane size={30} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reviews;
