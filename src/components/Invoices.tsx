"use client";

import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";
import { Invoice } from "@/utils/types";
import { FaAngleDoubleDown, FaSync } from "react-icons/fa";
import PullToRefresh from "react-pull-to-refresh"; // إضافة الاستيراد هنا

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useContext(ThemeContext);
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchInvoices = async () => {
    setLoading(true);
    const userRole =
      typeof window !== "undefined"
        ? localStorage.getItem("userRole") || "USER"
        : "USER";
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

      // تحقق من توفر `window` قبل استخدام `localStorage`
      if (typeof window !== "undefined") {
        localStorage.setItem("invoices", JSON.stringify(invoiceData || []));
      }

      setError(null);
    } catch (error) {
      setError("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  // استرجاع البيانات من localStorage عند تحميل الصفحة
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInvoices = localStorage.getItem("invoices");
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices);
        setInvoices(parsedInvoices);
        setFilteredInvoices(parsedInvoices);
        setLoading(false);
      } else {
        fetchInvoices();
      }
    }
  }, []);

  useEffect(() => {
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

  return (
    <div className="p-4">
      {/* حاوية ثابتة شفافة للسحب للتحديث */}
      <PullToRefresh onRefresh={fetchInvoices}>
        <div className="fixed flex iterm-center justify-center top-50 text-center left-0 right-0 h-10 bg-transparent z-10">
          <FaAngleDoubleDown className="mt-4 text-xl text-yellow-500 md:hidden" />
        </div>
      </PullToRefresh>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">الفواتير</h2>
        <button
          onClick={fetchInvoices}
          className={`flex fixed to-55 left-4 items-center w-10 h-10 px-2 py-1 rounded z-30 text-white hover:text-gray-600 focus:outline-none`}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader color="#ffffff" loading={loading} size={20} />
          ) : (
            <FaSync className="mr-1" />
          )}
        </button>
      </div>

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

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Invoices;
