"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/api";
import { ThemeContext } from "../../context/ThemeContext";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import GenericTable, { Column } from "@/components/dashboard/GenericTable";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClipLoader } from "react-spinners";
import Switch from "react-switch";
import "react-toastify/dist/ReactToastify.css";
import UserDetails from "./UserDetails";
import UserCard from "./UserCard";
import { useMediaQuery } from "react-responsive";
import AddUserForm from "./AddUserForm";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

// User interface defining the structure of user data
interface User {
  displayId: number;
  id: number;
  fullName: string;
  email: string;
  phoneNO: string;
  address: string;
  governorate: string;
  role: string;
  isActive: boolean;
}

// Interface for the data used in the user form
interface UserFormData {
  fullName: string;
  phoneNO: string;
  email: string;
  governorate: string;
  address: string;
  role: "USER" | "SUBADMIN" | "TECHNICAL" | "ADMIN";
  specialization?: string;
  services?: string;
}

const Users: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext); // Get dark mode state from context
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<User[]>([]); // State for user list
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [loding, setLoding] = useState(false); // State for loading spinner
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [usersByTab, setUsersByTab] = useState<{ [key: string]: User[] }>({});
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null); // State for user ID being toggled
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State for currently selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedTab, setSelectedTab] = useState("users"); // Current selected tab for filtering users
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" }); // Check if the screen is mobile size
  const [isAddingUser, setIsAddingUser] = useState(false); // State for adding a new user
  const userRole = localStorage.getItem("userRole"); // Get user role from local storage
  const router = useRouter();
  // Function to open the edit modal for a selected user
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to open the modal for adding a new user
  const openAddUserModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
    setIsAddingUser(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  // Function to handle adding a new user
  const handleAddUser = async (data: UserFormData) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";
      const response = await axios.post(`${API_BASE_URL}/users`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      //console.log("تم إضافة المستخدم بنجاح:", response.data);
      toast.success("تم إضافة المستخدم بنجاح!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("خطأ أثناء إضافة المستخدم:", error);
      toast.error("حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.");
    }
  };

  // Function to fetch the list of users based on the selected tab
  const fetchUsers = async () => {
    // تحقق إذا كانت البيانات الخاصة بالتاب الحالي موجودة بالفعل
    if (usersByTab[selectedTab]) {
      setUsers(usersByTab[selectedTab]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const authToken = token ? token.split("=")[1] : "";
      const endpoint =
        selectedTab === "technicians"
          ? "/users/technicians"
          : selectedTab === "subAdmins"
          ? "/users/subAdmins"
          : "/users";

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // تخزين البيانات حسب التاب لتجنب طلبها مرة أخرى
      const newData =
        selectedTab === "technicians"
          ? userRole === "SUBADMIN"
            ? response.data.subAdminTechnicians || []
            : response.data.adminTechnicians || []
          : selectedTab === "subAdmins"
          ? response.data.adminSubAdmins || []
          : response.data || [];

      // تحديث حالة المستخدمين وكائن التخزين المؤقت للبيانات
      setUsers(newData);
      setUsersByTab((prev) => ({ ...prev, [selectedTab]: newData }));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "فشل في جلب البيانات");
      } else {
        setError("حدث خطأ غير معروف");
      }
    } finally {
      setLoading(false);
    }
  };
  // useEffect to fetch users when the selected tab changes
  useEffect(() => {
    fetchUsers();
  }, [selectedTab]);

  // Function to handle toggling the active status of a user
  const handleToggleActive = (userId: number, currentStatus: boolean) => {
    confirmAlert({
      title: "تأكيد التغيير",
      message: `هل أنت متأكد من أنك تريد ${
        currentStatus ? "تعطيل" : "تفعيل"
      } حساب هذا المستخدم؟`,
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setTogglingUserId(userId);
            setLoding(true);
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
              const authToken = token ? token.split("=")[1] : "";

              await axios.put(
                `${API_BASE_URL}/users/${userId}`,
                { isActive: !currentStatus },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );

              // Update the user list with the new active status
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === userId
                    ? { ...user, isActive: !currentStatus }
                    : user
                )
              );

              toast.success(
                `تم ${!currentStatus ? "تفعيل" : "تعطيل"} الحساب بنجاح!`
              );
            } catch (error) {
              console.error("فشل في تحديث الحالة:", error);
              toast.error("حدث خطأ أثناء محاولة تحديث حالة الحساب.");
            } finally {
              setTogglingUserId(null);
              setLoding(false);
            }
          },
        },
        {
          label: "لا",
          onClick: () => {
            toast.info("تم إلغاء عملية التغيير.");
          },
        },
      ],
    });
  };

  // Function to handle deleting a user
  const handleDeleteUser = async (userId: number) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد من أنك تريد حذف هذا المستخدم؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setDeletingItemId(userId);
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
              const authToken = token ? token.split("=")[1] : "";

              await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });

              setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userId)
              );
              toast.success("تم حذف المستخدم بنجاح!");
            } catch (error) {
              console.error("فشل في حذف المستخدم:", error);
              toast.error("حدث خطأ أثناء محاولة حذف المستخدم.");
            } finally {
              setDeletingItemId(null);
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
  };

  // Function to handle view a user
  const handleViewUser = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const tableData = Array.isArray(users)
    ? users.map((user, index) => ({
        displayId: index + 1,
        id: user.id,
        fullName: user.fullName,
        governorate: user.governorate,
        role: user.role,
        email: user.email,
        phoneNO: user.phoneNO,
        address: user.address,
        isActive: user.isActive,
        actions: (
          <div className="flex space-x-2 justify-center">
            <button onClick={() => openEditModal(user)}>
              <FaEdit className="text-blue-500 hover:text-blue-700" />
            </button>
            <button
              onClick={() => handleDeleteUser(user.id)}
              disabled={deletingItemId === user.id}
            >
              {deletingItemId === user.id ? (
                <ClipLoader color="#FF6347" size={15} />
              ) : (
                <FaTrash className="text-red-500 hover:text-red-700" />
              )}
            </button>
            <button onClick={() => handleViewUser(user)}>
              <FaEye className="text-green-500 hover:text-green-700" />
            </button>
          </div>
        ),
      }))
    : [];

  const tableColumns: Column<User>[] = [
    { title: "#", accessor: "displayId" },
    { title: "اسم المستخدم", accessor: "fullName" },
    { title: "المحافظة", accessor: "governorate" },
    { title: "البريد الالكتروني", accessor: "email" },
    { title: "رقم الهاتف", accessor: "phoneNO" },
    { title: "العنوان", accessor: "address" },
    {
      title: "الحالة",
      render: (item: User) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Switch
            onChange={() => handleToggleActive(item.id, item.isActive)}
            checked={item.isActive}
            onColor="#4A90E2"
            offColor="#FF6347"
            height={20}
            width={40}
            disabled={togglingUserId === item.id}
          />
          {togglingUserId === item.id && (
            <CircularProgress size={16} className="inline ml-2" />
          )}
        </div>
      ),
    },
    {
      title: "العمليات",
      render: (item: User) => (
        <div className="flex  justify-center">
          <button
            className="ml-4"
            onClick={() => handleDeleteUser(item.id)}
            disabled={deletingItemId === item.id}
          >
            {deletingItemId === item.id ? (
              <ClipLoader color="#FF6347" size={15} />
            ) : (
              <FaTrash className="text-red-500 hover:text-red-700" />
            )}
          </button>
          <button onClick={() => handleViewUser(item)}>
            <FaEye className="text-green-500 hover:text-green-700" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={`p-5 mt-5 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">إدارة المستخدمين</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openAddUserModal}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center space-x-2"
        >
          <FaPlus /> <span>إضافة مستخدم جديد</span>
        </button>
      </div>
      {/* التبويبات */}
      <div className="flex justify-center  mb-4">
        <button
          onClick={() => setSelectedTab("users")}
          className={`px-4 py-2  ${
            selectedTab === "users" ? "bg-blue-700 text-white" : "bg-blue-500"
          }`}
        >
          المستخدمين
        </button>
        <button
          onClick={() => setSelectedTab("technicians")}
          className={`px-4 py-2 mx-2 ${
            selectedTab === "technicians"
              ? "bg-blue-700 text-white"
              : "bg-blue-500"
          }`}
        >
          التقنيين
        </button>
        {userRole === "ADMIN" && (
          <button
            onClick={() => setSelectedTab("subAdmins")}
            className={`px-4 py-2 ${
              selectedTab === "subAdmins"
                ? "bg-blue-700 text-white"
                : "bg-blue-500"
            }`}
          >
            مدراء المحافظات
          </button>
        )}
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={searchValue}
            onChange={handleSearchChange}
            className={`p-2 border rounded-lg outline-none  ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-gray-200 text-black border-gray-300"
            }`}
          />
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={() => openEditModal(user)}
                onDelete={() => handleDeleteUser(user.id)}
                onView={() => handleViewUser(user)}
                onToggleActive={() =>
                  handleToggleActive(user.id, user.isActive)
                }
              />
            ))
          ) : (
            <p>لا يوجد مستخدمون لعرضهم.</p>
          )}
        </div>
      ) : (
        <GenericTable data={tableData} columns={tableColumns} />
      )}

      {selectedUser && (
        <UserDetails user={selectedUser} onClose={handleCloseDetails} />
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`rounded-lg shadow-lg w-3/4 md:w-1/2 ${
              isDarkMode ? "bg-gray-800 text-light" : "bg-gray-200 text-black"
            } p-4 relative`}
            style={{ overflowY: "auto" }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 left-5 text-white hover:text-gray-600 "
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <AddUserForm onSubmit={handleAddUser} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
