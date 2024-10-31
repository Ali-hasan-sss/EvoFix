import React, { useState, useContext } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext"; // استيراد سياق الدارك مود

// استيراد الصور
import SyriatelImage from "../assets/images/syriatel.jpeg";
import MTNImage from "../assets/images/mtn.jpeg";
import { ClipLoader } from "react-spinners"; // استيراد سبينر

interface PaymentFormProps {
  requestId: number | null;
  closeModal: () => void;
  isInspectionPayment: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  requestId,
  closeModal,
  isInspectionPayment,
}) => {
  const [step, setStep] = useState(1);
  const [typePaid, setTypePaid] = useState<string | null>(null);
  const [OperationNumber, setOperationNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [CheckFee, setCheckFee] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل

  // جلب حالة الوضع (دارك/لايت)
  const { isDarkMode } = useContext(ThemeContext);

  const handleTypeSelect = (type: string) => {
    setTypePaid(type);
    setStep(2); // الانتقال للخطوة الثانية
  };

  const handleBack = () => {
    setStep(1); // العودة للخطوة الأولى
  };

  const handleSubmit = async () => {
    const finalAmount = isInspectionPayment ? Number(CheckFee) : Number(amount);
    const operationNum = Number(OperationNumber);

    if (
      !operationNum ||
      finalAmount <= 0 ||
      !textMessage.trim() ||
      !typePaid ||
      !requestId
    ) {
      toast.error("يرجى تعبئة جميع الحقول بشكل صحيح");
      return;
    }

    const token = Cookies.get("token");

    const paymentData = {
      typePaid,
      OperationNumber: operationNum,
      ...(isInspectionPayment
        ? { CheckFee: finalAmount }
        : { amount: finalAmount }),
      textMessage,
    };

    const apiUrl = isInspectionPayment
      ? `${API_BASE_URL}/maintenance-requests/${requestId}/accept_check`
      : `${API_BASE_URL}/epaid/${requestId}`;

    setIsLoading(true); // بدء التحميل
    try {
      await axios.post(apiUrl, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("تمت عملية الدفع بنجاح");
      closeModal();
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        (error.response.data as { message?: string }).message
      ) {
        const errorMessage = (error.response.data as { message: string })
          .message;
        toast.error(`حدث خطأ: ${errorMessage}`);
      } else {
        toast.error("حدث خطأ أثناء عملية الدفع");
      }
      console.error(error);
    } finally {
      setIsLoading(false); // إنهاء التحميل
    }
  };

  return (
    <div
      className={`w-full max-w-[500px] px-4 py-6 sm:max-w-md mx-auto ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {step === 1 ? (
        <div className="flex justify-center items-center gap-8">
          <div
            className="cursor-pointer rounded-full overflow-hidden"
            onClick={() => handleTypeSelect("SYRIATEL_CACH")}
          >
            <Image
              src={SyriatelImage}
              alt="Syriatel Payment"
              width={150}
              height={150}
              className="rounded-[50%] w-40 h-24 object-cover"
            />
          </div>
          <div
            className="cursor-pointer rounded-full overflow-hidden"
            onClick={() => handleTypeSelect("MTN_CACH")}
          >
            <Image
              src={MTNImage}
              alt="MTN Payment"
              width={150}
              height={150}
              className="rounded-[50%] w-40 h-24 object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Image
            src={typePaid === "SYRIATEL_CACH" ? SyriatelImage : MTNImage}
            alt="Selected Payment"
            width={150}
            height={150}
            className="w-40 h-40 object-contain mx-auto mb-2 mt-2"
          />
          <div className="mb-4 w-full">
            <label
              className={`block text-sm font-bold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              رقم عملية التحويل
            </label>
            <input
              type="number"
              value={OperationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4 w-full">
            <label
              className={`block text-sm font-bold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              المبلغ
            </label>
            <input
              type="number"
              value={isInspectionPayment ? CheckFee : amount}
              onChange={(e) =>
                isInspectionPayment
                  ? setCheckFee(e.target.value)
                  : setAmount(e.target.value)
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4 w-full">
            <label
              className={`block text-sm font-bold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              نص رسالة التحويل
            </label>
            <textarea
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              رجوع
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={isLoading} // تعطيل الزر أثناء التحميل
            >
              {isLoading ? (
                <ClipLoader size={20} color={"#ffffff"} />
              ) : (
                "إتمام عملية الدفع"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
