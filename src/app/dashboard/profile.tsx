import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import UserForm from "../../components/forms/UserForm"; // استيراد الفورم
import { toast } from "react-toastify"; // استيراد توست
import "react-toastify/dist/ReactToastify.css"; // استيراد CSS الخاص بالتوست
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa"; // استيراد الأيقونات

const Profile: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // حالة الحذف

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNO: "",
    governorate: "",
    address: "",
    specialization: "", // إضافة حقل الاختصاص
  });

  // تحديد نوع الحساب بناءً على role
  const isUser = userData?.role === "USER";
  const isTechnical = userData?.role === "TECHNICAL";

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "USER":
        return "مستخدم";
      case "TECHNICAL":
        return "تقني";
      case "SUBADMIN":
        return "مسؤول محافظة";
      case "ADMIN":
        return "مسؤول عام";
      default:
        return "غير معروف";
    }
  };

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");
    if (userId && token) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setFormData({
          name: response.data.fullName,
          email: response.data.email,
          phoneNO: response.data.phoneNO,
          governorate: response.data.governorate,
          address: response.data.address,
          specialization: response.data.specialization || "", // إضافة الاختصاص
        });
      } catch (error: unknown) {
        toast.error("خطأ في تحميل بيانات المستخدم");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("User ID or token is missing.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdate = async (updatedData: any) => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");
    if (token && userId) {
      setIsUpdating(true);
      try {
        await axios.put(`${API_BASE_URL}/users/${userId}`, updatedData, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(updatedData);
        setIsEditing(false);
        toast.success("تم تحديث البيانات بنجاح!");
      } catch (error: unknown) {
        toast.error("حدث خطأ أثناء تحديث البيانات.");
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error("User ID or token is missing.");
    }
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");
    if (token && userId) {
      const confirmDelete = window.confirm("هل أنت متأكد من حذف الحساب؟");
      if (confirmDelete) {
        setIsDeleting(true);
        try {
          await axios.delete(`${API_BASE_URL}/users/${userId}`, {
            withCredentials: true,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success("تم حذف الحساب بنجاح!");
          router.push("/login");
        } catch (error: unknown) {
          toast.error("حدث خطأ أثناء حذف الحساب.");
        } finally {
          setIsDeleting(false);
        }
      }
    } else {
      toast.error("User ID or token is missing.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: userData.fullName,
      email: userData.email,
      phoneNO: userData.phoneNO,
      governorate: userData.governorate,
      address: userData.address,
      specialization: userData.specialization || "", // إعادة ضبط الاختصاص
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin" />
      </div>
    );

  if (!userData) return <div>No data found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">بروفايل المستخدم</h1>
      {isEditing ? (
        <div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleCancelEdit}
              className="bg-red-400 text-white p-2 rounded flex items-center"
            >
              <FaTrash className="mr-2" />
              إلغاء
            </button>
          </div>
          <UserForm
            isNew={false}
            isUser={isUser} // تمرير isUser بناءً على نوع المستخدم
            isTechnical={isTechnical} // تمرير isTechnical بناءً على نوع المستخدم
            initialData={formData}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* عرض بيانات المستخدم */}
            <div>
              <p className="font-semibold">الاسم:</p>
              <p>{userData.fullName}</p>
            </div>

            <div>
              <p className="font-semibold">البريد الإلكتروني:</p>
              <p>{userData.email}</p>
            </div>

            <div>
              <p className="font-semibold">رقم الهاتف:</p>
              <p>{userData.phoneNO}</p>
            </div>

            <div>
              <p className="font-semibold">المحافظة:</p>
              <p>{userData.governorate}</p>
            </div>

            <div className="md:col-span-2">
              <p className="font-semibold">العنوان:</p>
              <p>{userData.address}</p>
            </div>

            <div>
              <p className="font-semibold">نوع الحساب:</p>
              <p>{getRoleLabel(userData.role)}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white p-3 rounded-md flex items-center"
            >
              <FaEdit className="mr-2" />
              تعديل
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white p-3 rounded-md flex items-center"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaTrash className="mr-2" />
              )}
              حذف الحساب
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
