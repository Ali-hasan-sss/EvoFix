import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
import { ClipLoader } from "react-spinners";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify"; // إضافة توست

// تعريف نوع السياسة
interface Policy {
  id: number;
  title: string;
  content: string;
  version?: string;
  isActive?: boolean;
}

const TermsOfUseAdmin: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false); // حالة التحميل للإرسال
  const [error, setError] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  // الحقول لعملية الإضافة
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/termsOfUsePolicy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolicies(
        Array.isArray(response.data.TermsPolicy)
          ? response.data.TermsPolicy
          : []
      );
    } catch (err) {
      setError("حدث خطأ أثناء جلب السياسات.");
    } finally {
      setLoading(false);
    }
  };

  const addPolicy = async () => {
    setLoadingSubmit(true); // بدء التحميل
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_BASE_URL}/termsOfUsePolicy`,
        { title: newTitle, content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPolicies([...policies, response.data]);
      toast.success("تمت إضافة السياسة بنجاح!"); // توست النجاح

      // إعادة تعيين القيم
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("خطأ أثناء إضافة السياسة:", err);
      toast.error("فشل في إضافة السياسة."); // توست الخطأ
    } finally {
      setLoadingSubmit(false); // انتهاء التحميل
    }
  };

  const updatePolicy = async (id: number, updatedData: Partial<Policy>) => {
    setLoadingSubmit(true); // بدء التحميل
    try {
      const token = Cookies.get("token");
      await axios.put(`${API_BASE_URL}/termsOfUsePolicy/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) =>
          policy.id === id ? { ...policy, ...updatedData } : policy
        )
      );
      setSelectedPolicy(null);
      toast.success("تمت تحديث السياسة بنجاح!"); // توست النجاح
    } catch (err) {
      console.error("خطأ أثناء تحديث السياسة:", err);
      toast.error("فشل في تحديث السياسة."); // توست الخطأ
    } finally {
      setLoadingSubmit(false); // انتهاء التحميل
    }
  };

  const deletePolicy = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/termsOfUsePolicy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolicies(policies.filter((policy) => policy.id !== id));
      toast.success("تم حذف السياسة بنجاح!"); // توست النجاح
    } catch (err) {
      console.error("خطأ أثناء حذف السياسة:", err);
      toast.error("فشل في حذف السياسة."); // توست الخطأ
    }
  };

  if (loading) return <ClipLoader color="#4A90E2" size={50} />;

  if (error) return <p>{error}</p>;

  return (
    <div className="mt-5 p-4 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        إدارة السياسات والشروط
      </h2>

      <ul className="space-y-4">
        {policies.map((policy) => (
          <li
            key={policy.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{policy.title}</h3>
                <p className="text-gray-600">{policy.content}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPolicy(policy)} // تهيئة الفورم للتعديل
                  className="text-blue-600 hover:text-blue-800"
                  title="تعديل"
                >
                  <FaPencilAlt className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deletePolicy(policy.id)}
                  className="text-red-600 hover:text-red-800"
                  title="حذف"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedPolicy ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">تعديل السياسة</h3>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updatePolicy(selectedPolicy.id, {
                title: selectedPolicy.title,
                content: selectedPolicy.content,
                version: selectedPolicy.version,
                isActive: selectedPolicy.isActive,
              });
            }}
          >
            <input
              type="text"
              value={selectedPolicy.title}
              onChange={(e) =>
                setSelectedPolicy({ ...selectedPolicy, title: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="عنوان السياسة"
            />
            <textarea
              value={selectedPolicy.content}
              onChange={(e) =>
                setSelectedPolicy({
                  ...selectedPolicy,
                  content: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="محتوى السياسة"
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
                loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
              }`} // تعطيل الزر أثناء التحميل
              disabled={loadingSubmit} // تعطيل الزر
            >
              {loadingSubmit ? (
                <ClipLoader color="#fff" size={20} />
              ) : (
                "حفظ التعديلات"
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">إضافة سياسة جديدة</h3>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              addPolicy();
            }}
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="عنوان السياسة"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="محتوى السياسة"
            />
            <button
              type="submit"
              className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
                loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
              }`} // تعطيل الزر أثناء التحميل
              disabled={loadingSubmit} // تعطيل الزر
            >
              {loadingSubmit ? <ClipLoader color="#fff" size={20} /> : "إضافة"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TermsOfUseAdmin;
