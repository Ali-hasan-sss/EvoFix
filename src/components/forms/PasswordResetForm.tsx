import React, { useState } from "react";

interface Errors {
  password?: string;
  confirmPassword?: string;
}

interface PasswordResetFormProps {
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  password: string;
  confirmPassword: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  darkMode: boolean;
  loading: boolean; // استقبال حالة اللودينغ
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  darkMode,
  loading,
}) => {
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    const errors: Errors = {};

    if (password.length < 8) {
      errors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل";
      valid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "كلمة المرور وتأكيد كلمة المرور غير متطابقين";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(password, confirmPassword);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-8 rounded shadow-md w-full max-w-sm ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        تعيين كلمة مرور جديدة
      </h2>

      <div className="mb-4">
        <label
          htmlFor="password"
          className={`block font-bold mb-2 ${darkMode ? "text-gray-300" : ""}`}
        >
          كلمة المرور الجديدة
        </label>
        <div className="relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            }`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className={`block font-bold mb-2 ${darkMode ? "text-gray-300" : ""}`}
        >
          تأكيد كلمة المرور
        </label>
        <div className="relative">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            }`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded hover:bg-blue-600 ${
          darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
        }`}
        disabled={loading} // تعطيل الزر إذا كان اللودينغ مفعل
      >
        {loading ? (
          <div className="flex justify-center">
            <div className="w-5 h-5 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          "تحديث كلمة المرور"
        )}
      </button>
    </form>
  );
};

export default PasswordResetForm;
