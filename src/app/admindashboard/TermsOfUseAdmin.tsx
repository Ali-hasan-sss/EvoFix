import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../ThemeContext";
import { ClipLoader } from "react-spinners";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

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
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const { isDarkMode } = useContext(ThemeContext);

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
    setLoadingSubmit(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_BASE_URL}/termsOfUsePolicy`,
        { title: newTitle, content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPolicies([...policies, response.data]);
      toast.success("تمت إضافة السياسة بنجاح!");

      // إعادة تعيين القيم
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("خطأ أثناء إضافة السياسة:", err);
      toast.error("فشل في إضافة السياسة.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const updatePolicy = async (id: number, updatedData: Partial<Policy>) => {
    setLoadingSubmit(true);
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
      toast.success("تمت تحديث السياسة بنجاح!");
    } catch (err) {
      console.error("خطأ أثناء تحديث السياسة:", err);
      toast.error("فشل في تحديث السياسة.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const deletePolicy = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/termsOfUsePolicy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolicies(policies.filter((policy) => policy.id !== id));
      toast.success("تم حذف السياسة بنجاح!");
    } catch (err) {
      console.error("خطأ أثناء حذف السياسة:", err);
      toast.error("فشل في حذف السياسة.");
    }
  };

  const closeModal = () => setSelectedPolicy(null);

  return (
    <div
      className={`mt-5 p-4 max-w-3xl mx-auto shadow rounded-lg ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
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
                  onClick={() => setSelectedPolicy(policy)}
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

      {(selectedPolicy || newTitle || newContent) && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
          <div
            className={`relative  p-6 rounded-lg shadow-lg max-w-md mx-auto w-full ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h3 className="text-lg font-semibold">
              {selectedPolicy ? "تعديل السياسة" : "إضافة سياسة جديدة"}
            </h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedPolicy) {
                  updatePolicy(selectedPolicy.id, {
                    title: selectedPolicy.title,
                    content: selectedPolicy.content,
                    version: selectedPolicy.version,
                    isActive: selectedPolicy.isActive,
                  });
                } else {
                  addPolicy();
                }
              }}
            >
              <input
                type="text"
                value={selectedPolicy?.title || newTitle}
                onChange={(e) =>
                  selectedPolicy
                    ? setSelectedPolicy({
                        ...selectedPolicy,
                        title: e.target.value,
                      })
                    : setNewTitle(e.target.value)
                }
                className="w-full p-2 border border-gray-300 text-black rounded"
                placeholder="عنوان السياسة"
              />
              <textarea
                value={selectedPolicy?.content || newContent}
                onChange={(e) =>
                  selectedPolicy
                    ? setSelectedPolicy({
                        ...selectedPolicy,
                        content: e.target.value,
                      })
                    : setNewContent(e.target.value)
                }
                className="w-full p-2 border text-black border-gray-300 rounded"
                placeholder="محتوى السياسة"
              />
              <div className="flex justify-between space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  إغلاق
                </button>
                <button
                  type="submit"
                  className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
                    loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? (
                    <ClipLoader color="#fff" size={20} />
                  ) : selectedPolicy ? (
                    "حفظ التعديلات"
                  ) : (
                    "إضافة"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsOfUseAdmin;
