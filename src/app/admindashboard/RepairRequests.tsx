import React, { useContext, useEffect, useMemo } from "react";
import { useRepairRequests } from "@/app/context/adminData";
import { ThemeContext } from "@/app/context/ThemeContext";
import Cookies from "js-cookie";
import GenericTable from "@/components/dashboard/GenericTable";
import { FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import RepairRequestCard from "@/components/RepairRequestCard";
import { RepairRequest } from "../../utils/types";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

const statusMap: { [key: string]: string } = {
  PENDING: "قيد الانتظار",
  ASSIGNED: "تم التعيين",
  QUOTED: "تم التسعير",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
};

const RepairRequestsPage: React.FC = () => {
  const {
    repairRequests = [],
    fetchRepairRequests,
    isLoading,
  } = useRepairRequests();

  const [isDeleting, setIsDeleting] = React.useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    fetchRepairRequests();
    console.log(repairRequests); // للتحقق من شكل البيانات
  }, []);

  const handleDelete = React.useCallback(
    async (id: number) => {
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
                await axios.delete(
                  `${API_BASE_URL}/maintenance-requests/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                toast.success("تم حذف الطلب بنجاح.");
                fetchRepairRequests(); // تحديث البيانات بعد الحذف
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
    },
    [fetchRepairRequests]
  );

  const columns = useMemo(
    () => [
      { title: "الاسم", accessor: "user.fullName" },
      { title: "المحافظة", accessor: "governorate" },
      { title: "رقم الهاتف", accessor: "user.phoneNO" },
      { title: "العنوان", accessor: "user.address" },
      { title: "نوع الجهاز", accessor: "deviceType" },
      { title: "وصف المشكلة", accessor: "problemDescription" },
      { title: "التقني المخصص", accessor: "technician.user.fullName" },
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

  const handleRequestUpdated = () => {
    console.log("done");
  };

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">طلبات الإصلاح</h1>

      {/* Check if repairRequests is loading or empty */}
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      ) : !repairRequests || repairRequests.length === 0 ? (
        <div className="text-center text-gray-500">
          لا توجد طلبات إصلاح حالياً.
        </div>
      ) : isMobile ? (
        <div>
          {Array.isArray(repairRequests) &&
            repairRequests.map((request) => (
              <RepairRequestCard
                onRequestUpdated={handleRequestUpdated}
                userRole={"ADMIN"}
                key={request.id}
                request={request}
                statusMap={statusMap}
              />
            ))}
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
