import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import GenericTable from "@/components/dashboard/GenericTable";
import { ThemeContext } from "@/app/ThemeContext";
import { FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import RepairRequestCard from "@/components/RepairRequestCard";
import { RepairRequest } from "../../utils/types"; // استيراد الواجهة المشتركة
import { useMediaQuery } from "react-responsive";

// تعريف statusMap خارج المكون لضمان عدم إعادة إنشائه في كل render
const statusMap: { [key: string]: string } = {
  PENDING: "قيد الانتظار",
  ASSIGNED: "تم التعيين",
  QUOTED: "تم التسعير",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
};

const RepairRequestsPage: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { isDarkMode } = useContext(ThemeContext);

  const handleDelete = useCallback(async (id: number) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد من أنك تريد حذف هذا الطلب؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setIsDeleting(true);
            try {
              const token = Cookies.get("token");
              await axios.delete(`${API_BASE_URL}/maintenance-requests/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              setRepairRequests((prev) => prev.filter((req) => req.id !== id));
              toast.success("تم حذف الطلب بنجاح.");
            } catch (error) {
              console.error("حدث خطأ أثناء حذف الطلب:", error);
              toast.error("حدث خطأ أثناء حذف الطلب. يرجى المحاولة مرة أخرى.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
        {
          label: "لا",
          onClick: () => {
            toast.info("تم إلغاء عملية الحذف.");
          },
        },
      ],
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "الاسم",
        accessor: "user.fullName",
      },
      {
        title: "المحافظة",
        accessor: "governorate",
      },
      {
        title: "رقم الهاتف",
        accessor: "user.phoneNO",
      },
      {
        title: "العنوان",
        accessor: "user.address",
      },
      {
        title: "نوع الجهاز",
        accessor: "deviceType",
      },
      {
        title: "وصف المشكلة",
        accessor: "problemDescription",
      },
      {
        title: "التقني المخصص",
        accessor: "technician.user.fullName",
      },
      {
        title: "الحالة",
        accessor: "status",
        render: (item: RepairRequest) => statusMap[item.status] || item.status,
      },
      {
        title: "العمليات",
        render: (item: RepairRequest) => (
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-500 hover:text-red-700 flex items-center"
            disabled={isDeleting}
          >
            <FaTrash className="mr-2" />
            حذف
          </button>
        ),
      },
    ],
    [handleDelete, isDeleting]
  );

  useEffect(() => {
    const fetchRepairRequests = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}/maintenance-requests/all/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            setRepairRequests(response.data);
          } else {
            console.warn("Expected an array but got:", response.data);
            setRepairRequests([]);
          }
        } else {
          console.warn("لا توجد بيانات في الاستجابة.");
          toast.warn("لا توجد بيانات متاحة.");
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
        toast.error("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepairRequests();
  }, []);
  const handleRequestUpdated = () => {
    // يمكنك إعادة جلب الطلبات هنا أو تحديث الحالة
    console.log("done"); // تأكد من أن لديك هذه الدالة متاحة
  };
  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">طلبات الإصلاح</h1>

      {loading && repairRequests.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      ) : isMobile ? (
        <div>
          {repairRequests.length > 0 ? (
            repairRequests.map((request) => (
              <RepairRequestCard
                onRequestUpdated={handleRequestUpdated}
                userRole={"ADMIN"}
                key={request.id}
                request={request}
                statusMap={statusMap}
              />
            ))
          ) : (
            <div>لا توجد طلبات إصلاح متاحة.</div>
          )}
        </div>
      ) : (
        <GenericTable<RepairRequest> data={repairRequests} columns={columns} />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default RepairRequestsPage;
