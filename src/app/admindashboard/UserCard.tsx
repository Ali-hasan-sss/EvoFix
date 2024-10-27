import { useContext } from "react";
import React from "react";
import { ThemeContext } from "../ThemeContext";
import Switch from "react-switch";
import { FaTrash, FaEye } from "react-icons/fa";

interface User {
  displayId: number;
  fullName: string;
  email: string;
  phoneNO: string;
  address: string;
  governorate: string;
  role: string;
  isActive: boolean;
}

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onToggleActive: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onView,
  onToggleActive,
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`border rounded-lg p-4 shadow-md mb-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } transition duration-300 ease-in-out`}
    >
      <h3
        className={`text-lg font-semibold mb-2 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {user.fullName}
      </h3>
      <p className="mb-1">
        <strong>البريد الالكتروني:</strong> {user.email}
      </p>
      <p className="mb-1">
        <strong>رقم الهاتف:</strong> {user.phoneNO}
      </p>
      <p className="mb-1">
        <strong>العنوان:</strong> {user.address}
      </p>
      <p className="mb-1">
        <strong>المحافظة:</strong> {user.governorate}
      </p>
      <p className="mb-1">
        <strong>نوع المستخدم:</strong> {user.role}
      </p>
      <p className="mb-1 item-center">
        <Switch
          className="mr-5"
          onChange={onToggleActive}
          checked={user.isActive}
          onColor="#4A90E2"
          offColor="#FF6347"
          height={20}
          width={40}
        />
      </p>
      <div className="flex gap-4 m-4">
        <button
          onClick={onView}
          className="text-green-500 hover:text-green-700 font-semibold transition-colors duration-200"
        >
          <FaEye />
        </button>

        <button
          onClick={onDelete}
          className=" text-red-500 hover:text-red-700 font-semibold transition-colors duration-200"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
