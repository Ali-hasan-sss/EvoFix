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

const Tasks = () => {
  const [inProgressRequests, setInProgressRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInProgressRequests = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}/maintenance-requests/all/in-progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          setInProgressRequests(response.data);
        } else {
          console.warn("البيانات المستلمة ليست مصفوفة.");
          toast.warn("لا يوجد مهام لعرضها");
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
        toast.error("حدث خطأ أثناء جلب البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressRequests();
  }, []);

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${API_BASE_URL}/maintenance-requests/${requestId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تسليم المهمة بنجاح.");
        // إعادة تحميل البيانات بعد التسليم
        setInProgressRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      } else {
        toast.warn("فشل في تسليم المهمة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء تسليم المهمة:", error);
      toast.error("حدث خطأ أثناء تسليم المهمة.");
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
        inProgressRequests.map((request) => (
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
              onClick={() => handleCompleteRequest(request.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              تسليم المهمة
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
