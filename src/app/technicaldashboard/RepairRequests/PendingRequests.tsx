import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../utils/api";

interface Request {
  id: string;
  deviceName: string;
  deviceType: string;
  issueDescription: string;
  status: string;
}

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null); // الطلب المحدد لعرض الفورم
  const [cost, setCost] = useState<number | null>(null); // التكلفة التي يتم إدخالها

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}/maintenance-requests/all/assign`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          setPendingRequests(response.data);
        } else {
          console.warn("البيانات المستلمة ليست مصفوفة.");
          toast.warn("البيانات المستلمة غير صحيحة.");
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
        toast.error("حدث خطأ أثناء جلب البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  // دالة لإرسال التكلفة إلى API
  // دالة لإرسال التكلفة إلى API
  const handleSubmitCost = async (requestId: string) => {
    try {
      console.log("قيمة cost:", cost);
      console.log("نوع cost:", typeof cost);

      const token = Cookies.get("token");
      const response = await axios.put(
        `${API_BASE_URL}/maintenance-requests/${requestId}/quote`,
        { cost }, // إرسال التكلفة كـ رقم
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم إرسال التكلفة بنجاح.");
        setSelectedRequest(null); // إغلاق الفورم بعد الإرسال
        setCost(null); // إعادة تعيين التكلفة
      } else {
        toast.warn("حدث خطأ أثناء إرسال التكلفة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال التكلفة:", error);
      toast.error("حدث خطأ أثناء إرسال التكلفة.");
    }
  };

  return (
    <div
      className="w-full flex-grow grid gap-4 overflow-y-auto"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {loading ? (
        <p>جارٍ تحميل البيانات...</p>
      ) : (
        pendingRequests.map((request) => (
          <div key={request.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-2">{request.deviceName}</h2>
            <p>
              <strong>نوع الجهاز:</strong> {request.deviceType}
            </p>
            <p>
              <strong>وصف العطل:</strong> {request.issueDescription}
            </p>
            <p>
              <strong>الحالة:</strong> {request.status}
            </p>
            <button
              onClick={() => setSelectedRequest(request.id)} // عرض الفورم
              className="mt-4 py-2 px-4 rounded bg-green-500 text-white hover:bg-green-400"
            >
              تحديد التكلفة
            </button>

            {/* عرض الفورم عند اختيار الطلب */}
            {selectedRequest === request.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-1/3">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedRequest(null)} // إغلاق الفورم
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-semibold mb-4">إدخال التكلفة</h3>
                  <input
                    type="number"
                    value={cost ?? ""} // عرض التكلفة، وإذا كانت null، يتم عرض حقل فارغ
                    onChange={(e) => setCost(parseFloat(e.target.value))} // تحويل النص إلى رقم
                    className="w-full p-2 border rounded mb-4"
                    placeholder="أدخل التكلفة"
                  />
                  <div className="flex justify-end">
                    <button
                      className="py-2 px-4 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleSubmitCost(request.id)} // إرسال التكلفة
                    >
                      حفظ
                    </button>
                    <button
                      className="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400"
                      onClick={() => setSelectedRequest(null)} // إغلاق الفورم بدون حفظ
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PendingRequests;
