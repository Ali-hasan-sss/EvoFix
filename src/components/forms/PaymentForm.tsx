import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "@/utils/api";

interface PaymentFormProps {
  requestId: number | null;
  closeModal: () => void;
  isInspectionPayment: boolean; // تحديد نوع الدفع
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  requestId,
  closeModal,
  isInspectionPayment,
}) => {
  const [step, setStep] = useState(1);
  const [typePaid, setTypePaid] = useState<string | null>(null);
  const [operationNumber, setOperationNumber] = useState("");
  const [amount, setAmount] = useState(""); // تم تعديل المفتاح من checkFee إلى amount
  const [textMessage, setTextMessage] = useState("");

  const handleTypeSelect = (type: string) => {
    setTypePaid(type);
    setStep(2); // الانتقال إلى الخطوة الثانية
  };

  const handleSubmit = async () => {
    if (
      !operationNumber ||
      !amount ||
      !textMessage ||
      !typePaid ||
      !requestId
    ) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }

    // جلب التوكن من الكوكيز
    const token = Cookies.get("token"); // تأكد من أن اسم الكوكيز يتطابق مع ما تم إعداده في النظام

    // إعداد بيانات الدفع لإرسالها
    const paymentData = {
      requestId,
      typePaid,
      operationNumber,
      amount, // المفتاح الجديد
      textMessage,
    };

    // تحديد الرابط المناسب بناءً على نوع الدفع
    const apiUrl = isInspectionPayment
      ? `${API_BASE_URL}/maintenance-requests/${requestId}/accept_check`
      : `${API_BASE_URL}/epaid/${requestId}`;

    // إرسال الطلب مع تضمين التوكن في الهيدر
    try {
      await axios.post(apiUrl, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`, // تضمين التوكن في الهيدر
        },
      });
      toast.success("تمت عملية الدفع بنجاح");
      closeModal(); // إغلاق المودال
    } catch (error) {
      toast.error("حدث خطأ أثناء عملية الدفع");
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel="Payment Modal"
      className="modal-class"
      overlayClassName="modal-overlay"
    >
      {step === 1 ? (
        <div className="flex justify-center items-center">
          <div
            className="cursor-pointer"
            onClick={() => handleTypeSelect("SYRIATEL_CACH")}
          >
            <Image
              src="/components/assets/images/syriatel.jpeg"
              alt="Syriatel Payment"
              width={150}
              height={150}
            />
          </div>
          <div
            className="cursor-pointer ml-4"
            onClick={() => handleTypeSelect("MTN_CACH")}
          >
            <Image
              src="/components/assets/images/mtn.jpeg"
              alt="MTN Payment"
              width={150}
              height={150}
            />
          </div>
        </div>
      ) : (
        <div className="text-center transition-all">
          <Image
            src={`/components/images/${
              typePaid === "SYRIATEL_CACH" ? "syriatel.jpeg" : "mtn.jpeg"
            }`}
            alt="Selected Payment"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              رقم عملية التحويل
            </label>
            <input
              type="text"
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              المبلغ
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              نص رسالة التحويل
            </label>
            <textarea
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            إتمام عملية الدفع
          </button>
        </div>
      )}
    </Modal>
  );
};

export default PaymentForm;
