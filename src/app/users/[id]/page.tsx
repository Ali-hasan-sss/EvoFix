"use client";

import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import Navbar from "@/components/navBar";
import UserForm from "@/components/forms/UserForm";
import { Modal, CircularProgress } from "@mui/material";
import Switch from "react-switch";
import { ThemeContext } from "@/app/context/ThemeContext";
import { CombinedUserFormInput } from "@/utils/types";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaArrowCircleRight } from "react-icons/fa";

interface TechnicianDetails {
  id: number;
  specialization: string;
  services: string;
}

interface SubAdminDetails {
  id: number;
  department: string;
  governorate: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  avatar: string | null;
  technician?: TechnicianDetails;
  subadmin?: SubAdminDetails;
}

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const isNew = false;
  const router = useRouter();
  const [formData, setFormData] = useState<CombinedUserFormInput | null>(null);

  useEffect(() => {
    if (id) {
      const authToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || "";

      axios
        .get(`${API_BASE_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          setFormData({
            fullName: response.data.fullName,
            email: response.data.email,
            phoneNO: response.data.phoneNO,
            governorate: response.data.governorate,
            address: response.data.address,
            specialization: response.data.technician?.specialization || "",
            services: response.data.technician?.services || "",
            department:
              response.data.role === "SUBADMIN"
                ? response.data.subadmin?.department || ""
                : undefined,
            admin_governorate:
              response.data.role === "SUBADMIN"
                ? response.data.subadmin?.governorate || ""
                : undefined,
            role: response.data.role,
            isActive: response.data.isActive,
            password: "",
            confirmPassword: "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
          setEditing(false);
        });
    }
  }, [id]);

  const handelGoBack = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "ADMIN" || userRole === "SUBADMIN") {
      router.push("/admindashboard");
    } else if (userRole === "TECHNICAL") {
      router.push("/technicaldashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const editUser = async (formData: CombinedUserFormInput) => {
    setEditing(true);
    const authToken =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || "";

    if (user) {
      try {
        const dataToSend = {
          fullName: formData.fullName,
          email: formData.email,
          phoneNO: formData.phoneNO,
          governorate: formData.governorate,
          address: formData.address,
          admin_governorate: formData.admin_governorate,
          specialization: formData.specialization,
          services: formData.services,
        };

        await axios.put(`${API_BASE_URL}/users/${user.id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        toast.success("تم تحديث بيانات المستخدم بنجاح!");
        setShowEditModal(false);

        // تحديث بيانات المستخدم مباشرة بدون إعادة تحميل
        setUser((prev) => ({
          ...prev!,
          ...formData,
        }));
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث بيانات المستخدم.");
        console.error("Error updating user data:", error);
      } finally {
        setEditing(false);
        setLoading(false);
      }
    }
  };

  //************* */
  const toggleActiveStatus = async () => {
    if (user) {
      setEditing(true);
      const authToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || "";

      try {
        const updatedUser = { isActive: !user.isActive };
        await axios.put(`${API_BASE_URL}/users/${user.id}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        // تحديث حالة التفعيل مباشرة بدون إعادة تحميل
        setUser((prev) => ({ ...prev!, isActive: !prev!.isActive }));
        toast.success("تم تحديث حالة التفعيل بنجاح!");
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث حالة التفعيل.");
        console.error("Error updating user activation status:", error);
      } finally {
        setEditing(false);
        setLoading(false);
      }
    }
  };

  // عرض السبينر أثناء التحميل
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-200"
        }`}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!user) return <p>لم يتم العثور على المستخدم</p>;

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div
        className={`pt-20 mt-10 w-full p-6 bg-gray-100 shadow-lg rounded-lg md:flex md:flex-col  text-right ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
        }`}
        style={{ minHeight: "100vh" }}
      >
        <button onClick={handelGoBack}>
          <FaArrowCircleRight className="text-3xl" />
        </button>
        <h1 className="text-3xl font-bold mb-6">معلومات المستخدم</h1>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 w-full ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
          }`}
        >
          <p className="border border-gray-300 rounded p-3">
            <strong>الاسم:</strong> {user.fullName}
          </p>
          <p className="border border-gray-300 rounded p-3">
            <strong>البريد الإلكتروني:</strong> {user.email}
          </p>
          <p className="border border-gray-300 rounded p-3">
            <strong>رقم الهاتف:</strong> {user.phoneNO}
          </p>
          <p className="border border-gray-300 rounded p-3">
            <strong>المحافظة:</strong> {user.governorate}
          </p>
          <p className="border border-gray-300 rounded p-3">
            <strong>العنوان:</strong> {user.address}
          </p>
          <p className="border border-gray-300 rounded p-3">
            <strong>الدور:</strong>
            {user.role === "TECHNICAL"
              ? "فني"
              : user.role === "SUBADMIN"
              ? "مسؤول فرعي"
              : user.role === "ADMIN"
              ? "مسؤول"
              : "مستخدم"}
          </p>
          <div className="border relative border-gray-300 rounded p-3">
            <strong>الحالة:</strong>
            {user.isActive ? (
              <span className="absolute top-4 left-5 bg-green-500 rounded-full w-3 h-3"></span>
            ) : (
              <span className="absolute top-4 left-5 bg-red-500 rounded-full w-3 h-3"></span>
            )}

            <Switch
              checked={user.isActive}
              onChange={toggleActiveStatus}
              onColor="#4A90E2"
              offColor="#FF6347"
              height={20}
              width={40}
              className="mr-2"
            />

            {/* إضافة السبينر بجانب السويتش في حالة التحميل */}
            <div className="absolute top-4 right-20 mr-10 h-5 w-5">
              {editing && (
                <CircularProgress size={16} className="inline ml-2" />
              )}
            </div>
          </div>

          <div className="border relative border-gray-300 rounded p-3">
            <strong>التحقق:</strong>
            {user.isVerified ? (
              <span className="absolute top-4 right-20 bg-green-500 rounded-full w-3 h-3"></span>
            ) : (
              <span className="absolute top-4 right-16 bg-red-500 rounded-full w-3 h-3"></span>
            )}
          </div>
          <p className="border border-gray-300 rounded p-3">
            <strong>تاريخ الإنشاء:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString("ar-EG")}
          </p>

          {/* معلومات إضافية للمستخدمين التقنيين */}
          {user.role === "TECHNICAL" && user.technician && (
            <>
              <p className="border border-gray-300 rounded p-3">
                <strong>التخصص:</strong> {user.technician.specialization}
              </p>
              <p className="border border-gray-300 rounded p-3">
                <strong>الخدمات:</strong> {user.technician.services}
              </p>
            </>
          )}

          {/* معلومات إضافية للمستخدمين السب أدمن */}
          {user.role === "SUBADMIN" && user.subadmin && (
            <>
              <p className="border border-gray-300 rounded p-3">
                <strong>القسم:</strong> {user.subadmin.department}
              </p>
              <p className="border border-gray-300 rounded p-3">
                <strong>القطاع:</strong> {user.subadmin.governorate}
              </p>
            </>
          )}
          <button
            onClick={handleEditClick}
            className="mt-6 bg-blue-500 inline text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            تعديل المستخدم
          </button>
        </div>

        {showEditModal && (
          <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
            <div className="p-4 bg-gray-800 rounded-md shadow-md w-1/2 mx-auto my-20 max-w-md">
              {formData && (
                <UserForm
                  initialData={formData}
                  onSubmit={editUser}
                  isNew={isNew}
                  isTechnical={user.role === "TECHNICAL"}
                  isSubAdmin={user.role === "SUBADMIN"}
                  onClose={() => setShowEditModal(false)}
                  submitButtonLabel={isNew ? "إضافة" : "تعديل"}
                />
              )}
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default UserPage;
