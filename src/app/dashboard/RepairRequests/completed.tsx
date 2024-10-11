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

const Completed = () => {
  const [inProgressRequests, setInProgressRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInProgressRequests = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}/maintenance-requests/all/complete`,
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
          toast.warn("البيانات المستلمة غير صحيحة.");
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
          </div>
        ))
      )}
    </div>
  );
};

export default Completed;
