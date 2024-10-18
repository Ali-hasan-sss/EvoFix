import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
interface PricingFormProps {
  requestId: string; // معرف الطلب ليتم إرساله مع التسعير
  onClose: () => void; // دالة لإغلاق المودال
}

const PricingForm: React.FC<PricingFormProps> = ({ requestId, onClose }) => {
  const [cost, setCost] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cost === "" || cost < 0) {
      setError("يجب إدخال تكلفة صالحة أكبر من أو تساوي 0");
      return;
    }

    try {
      const token = Cookies.get("token"); // جلب التوكن من الكوكيز
      await axios.put(
        `${API_BASE_URL}/api/maintenance-requests/${requestId}/quote`,
        { cost },
        {
          headers: {
            Authorization: `Bearer ${token}`, // تضمين التوكن في الهيدر
          },
        }
      );
      onClose(); // إغلاق المودال عند نجاح الإرسال
    } catch (err) {
      console.error("خطأ أثناء تسعير الطلب:", err);
      setError("حدث خطأ أثناء تسعير الطلب.");
    }
  };

  return (
    <div>
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
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="أدخل التكلفة"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          حفظ
        </button>
      </form>
    </div>
  );
};

export default PricingForm;
