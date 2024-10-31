"use client";

import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";
//add
interface Invoice {
  amount: number;
  issueDate: string;
  dueDate: string;
  isPaid: boolean;
  paidAt?: string | null;
  user: {
    fullName: string;
  };
  request: {
    deviceType: string;
    deviceModel: string;
    problemDescription: string;
    isPaidCheckFee: boolean;
    governorate: string;
    Epaid: {
      CheckFee: number;
    }[];
  };
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useContext(ThemeContext);
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchInvoices = async () => {
    const userRole = localStorage.getItem("userRole") || "USER";
    const endpoint = `${API_BASE_URL}/users/invoices`;

    try {
      const response = await axiosInstance.get<{
        adminInvoice: Invoice[];
        userInvoice: Invoice[];
      }>(endpoint);
      const invoiceData =
        response.data[userRole === "ADMIN" ? "adminInvoice" : "userInvoice"];

      setInvoices(invoiceData || []);
      setFilteredInvoices(invoiceData || []);
      setLoading(false);
    } catch (error) {
      setError("حدث خطأ أثناء جلب البيانات");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    // تحديث الفواتير المعروضة بناءً على حالة الدفع واسم المستخدم
    const filtered = invoices.filter((invoice) => {
      const matchesStatus =
        paymentStatus === "all" ||
        (paymentStatus === "paid" && invoice.isPaid) ||
        (paymentStatus === "unpaid" && !invoice.isPaid);
      const matchesSearch = invoice.user.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
    setFilteredInvoices(filtered);
  }, [paymentStatus, searchTerm, invoices]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <ClipLoader color="#4A90E2" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">الفواتير</h2>

      {/* مكونات الفلترة والبحث */}
      <div className="mb-4 flex gap-4">
        <select
          className="border p-2 rounded text-black"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option value="all">كل الفواتير</option>
          <option value="paid">مدفوعة</option>
          <option value="unpaid">غير مدفوعة</option>
        </select>
        <input
          type="text"
          placeholder="ابحث بالاسم"
          className="border p-2 rounded w-full text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* عرض الفواتير */}
      {filteredInvoices.map((invoice, index) => (
        <div
          key={index}
          className={`border rounded-lg p-4 mb-4 shadow-md transition duration-300 ${
            isDarkMode ? "bg-gray-900 text-light" : "bg-gray-200 text-black"
          }`}
        >
          <p>
            <strong>الاسم:</strong> {invoice.user.fullName}
          </p>
          <p>
            <strong>المبلغ:</strong> {invoice.amount} ل.س
          </p>
          <p>
            <strong>تاريخ الإصدار:</strong>{" "}
            {new Date(invoice.issueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>تاريخ الاستحقاق:</strong>{" "}
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>مدفوع:</strong> {invoice.isPaid ? "نعم" : "لا"}
          </p>
          {invoice.paidAt && (
            <p>
              <strong>تاريخ الدفع:</strong>{" "}
              {new Date(invoice.paidAt).toLocaleDateString()}
            </p>
          )}
          <h4 className="font-semibold mt-2">تفاصيل الجهاز</h4>
          <p>
            <strong>نوع الجهاز:</strong> {invoice.request.deviceType}
          </p>
          <p>
            <strong>موديل الجهاز:</strong> {invoice.request.deviceModel}
          </p>
          <p>
            <strong>الوصف:</strong> {invoice.request.problemDescription}
          </p>
          <p>
            <strong>المحافظة:</strong> {invoice.request.governorate}
          </p>
          <p>
            <strong>رسوم الكشف:</strong> {invoice.request.Epaid[0]?.CheckFee}{" "}
            ل.س
          </p>
          <p>
            <strong>رسوم الكشف مدفوعة:</strong>{" "}
            {invoice.request.isPaidCheckFee ? "نعم" : "لا"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Invoices;
