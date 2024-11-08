"use client";
import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DataCountsProvider, {
  useDataCounts,
} from "@/app/context/DataCountsContext";

// Enable necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Request statistics interface
interface RequestStats {
  unreadNotifications: number;
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  rejectedRequests: number;
  faqCount: number;
}

const DashboardHome: React.FC = () => {
  const stats = useDataCounts();

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (stats?.fetchCounts) {
        await stats.fetchCounts();
      }
    };

    fetchData();
  }, []);

  // Display loading indicator if data is not yet available
  if (!stats) {
    return <div>Loading...</div>;
  }

  // Doughnut chart data configuration
  const data = {
    labels: ["مكتملة", "معلقة", "قيد التنفيذ", "مرفوضة"],
    datasets: [
      {
        data: [
          stats.completedRequests,
          stats.pendingRequests + stats.assignedRequests + stats.quotedRequests,
          stats.inProgressRequests,
          stats.rejectedRequests,
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#03A9F4", "#F44336"],
      },
    ],
  };
  console.log(`nat${stats.notifications}`);
  return (
    <div className="p-2 pt-5 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        لوحة التحكم
      </h1>
      {/* Notification and request summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.notifications > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg relative">
            {/* Indicator for unread notifications */}
            <span className="absolute top-2 right-2 bg-red-500 rounded-full w-2 h-2"></span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              الإشعارات غير المقروءة
            </h2>
            <p className="text-2xl font-bold text-blue-500">
              {stats.notifications}
            </p>
          </div>
        )}
        {stats.activationRequests > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg relative">
            {/* Indicator for account activation requests */}
            <span className="absolute top-2 right-2 bg-red-500 rounded-full w-2 h-2"></span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              طلبات تفعيل حساب تقني
            </h2>
            <p className="text-2xl font-bold text-blue-500">
              {stats.activationRequests}
            </p>
          </div>
        )}
        {stats.faqCount > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg relative">
            {/* Indicator for unanswered FAQs */}
            <span className="absolute top-2 right-2 bg-red-500 rounded-full w-2 h-2"></span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              أسئلة بحاجة اجابة
            </h2>
            <p className="text-2xl font-bold text-blue-500">{stats.faqCount}</p>
          </div>
        )}

        {/* Various request statistics cards */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            جميع الطلبات
          </h2>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {stats.totalRequests}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            الطلبات المكتملة
          </h2>
          <p className="text-2xl font-bold text-green-500">
            {stats.completedRequests}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            الطلبات المعلقة
          </h2>
          <p className="text-2xl font-bold text-yellow-500">
            {stats.pendingRequests}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            طلبات قيد المعاينة
          </h2>
          <p className="text-2xl font-bold text-yellow-500">
            {stats.assignedRequests}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            طلبات قيد الموافقة
          </h2>
          <p className="text-2xl font-bold text-yellow-500">
            {stats.quotedRequests}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            الطلبات قيد التنفيذ
          </h2>
          <p className="text-2xl font-bold text-blue-500">
            {stats.inProgressRequests}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            الطلبات المرفوضة
          </h2>
          <p className="text-2xl font-bold text-red-500">
            {stats.rejectedRequests}
          </p>
        </div>
      </div>

      {/* Doughnut chart for request status distribution */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
        <div className="flex item-center " style={{ width: "40vw" }}>
          <Doughnut data={data} width={2000} height={2000} />
        </div>
      </div>

      {/* Additional information for admins */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          معلومات إضافية
        </h2>
        <ul className="text-gray-700 dark:text-gray-300">
          <li>عدد المستخدمين النشطين: 150</li>
          <li>آخر تحديث للنظام: 15 أكتوبر 2024</li>
          <li>الإحصائيات محدثة يوميًا</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
