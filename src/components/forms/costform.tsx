import React, { useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";

interface PricingFormProps {
  requestId: string;
  onClose: () => void;
  onRequestUpdated: () => void;
}

const PricingForm: React.FC<PricingFormProps> = ({
  requestId,
  onClose,
  onRequestUpdated,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [cost, setCost] = useState<number | "">("");
  const [resultCheck, setResultCheck] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من أن التكلفة رقم صحيح وأن وصف العطل ليس فارغًا
    if (cost === "" || Number(cost) < 0 || resultCheck.trim() === "") {
      setError("يجب إدخال تكلفة صالحة ووصف العطل");
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      await axios.put(
        `${API_BASE_URL}/maintenance-requests/${requestId}/quote`,
        {
          cost: Number(cost), // التأكد من إرسال التكلفة كـ number
          resultCheck,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRequestUpdated();
      onClose();
    } catch (err) {
      console.error("خطأ أثناء تسعير الطلب:", err);
      setError("حدث خطأ أثناء تسعير الطلب.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-6 rounded shadow-md max-w-md w-full`}
      >
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="cost" className="block font-bold mb-2">
              التكلفة
            </label>
            <input
              type="number"
              id="cost"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className={`w-full p-2 border text-black ${
                isDarkMode ? "border-gray-600" : "border-gray-300"
              } rounded`}
              placeholder="أدخل التكلفة"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="resultCheck" className="block font-bold mb-2">
              وصف العطل
            </label>
            <textarea
              id="resultCheck"
              value={resultCheck}
              onChange={(e) => setResultCheck(e.target.value)}
              className={`w-full p-2 border text-black ${
                isDarkMode ? "border-gray-600" : "border-gray-300"
              } rounded`}
              placeholder="أدخل وصف العطل"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              disabled={isLoading}
            >
              إغلاق
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader color="#fff" size={20} /> : "ارسال"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingForm;
