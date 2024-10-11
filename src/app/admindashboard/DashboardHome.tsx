import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// تفعيل المكونات المطلوبة من Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DashboardHome = () => {
  // إعداد البيانات لمنحنى بياني
  const data = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
    datasets: [
      {
        label: "الطلبات المكتملة",
        data: [10, 20, 15, 30, 25, 35],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#ffffff", // نص الأسطورة للتكيف مع الدارك مود
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff", // النص على المحور x للتكيف مع الدارك مود
        },
      },
      y: {
        ticks: {
          color: "#ffffff", // النص على المحور y للتكيف مع الدارك مود
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        مرحباً بعودتك!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ملخص الحساب */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ملخص الحساب
          </h2>
          <p className="text-gray-700 dark:text-gray-300">الاسم: أحمد</p>
          <p className="text-gray-700 dark:text-gray-300">
            البريد الإلكتروني: ahmed@example.com
          </p>
          <p className="text-gray-700 dark:text-gray-300">الدور: مستخدم</p>
          <p className="text-gray-700 dark:text-gray-300">
            الحالة: <span className="text-green-500">مفعل</span>
          </p>
        </div>

        {/* إحصائيات */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            إحصائيات الطلبات
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            الطلبات المفتوحة: 5
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            الطلبات المكتملة: 12
          </p>
        </div>

        {/* إشعارات */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            الإشعارات
          </h2>
          <ul className="text-gray-700 dark:text-gray-300">
            <li>إشعار جديد: لديك طلب مفتوح</li>
            <li>تم تحديث طلبك</li>
          </ul>
        </div>
      </div>

      {/* منحنى بياني */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          الطلبات المكتملة (آخر 6 شهور)
        </h2>
        <Line data={data} options={options} />
      </div>

      {/* روابط سريعة */}
      <div className="mt-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          إضافة طلب جديد
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
