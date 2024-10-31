// pages/dashboard/index.tsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

// تفعيل مكونات Chart.js اللازمة
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

// واجهة بيانات الطلبات
interface RequestStats {
  unreadNotifications: number;
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  rejectedRequests: number;
}

// المكون الرئيسي للداشبورد
const DashboardHome: React.FC<{ stats: RequestStats }> = ({ stats }) => {
  // بيانات المخطط الدائري
  const data = {
    labels: ["مكتملة", "معلقة", "قيد التنفيذ", "مرفوضة"],
    datasets: [
      {
        data: [
          stats.completedRequests,
          stats.pendingRequests,
          stats.inProgressRequests,
          stats.rejectedRequests,
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#03A9F4", "#F44336"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        لوحة التحكم
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* مربع الإشعارات غير المقروءة */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            الإشعارات غير المقروءة
          </h2>
          <p className="text-2xl font-bold text-blue-500">
            {stats.unreadNotifications}
          </p>
        </div>

        {/* مربعات الطلبات حسب الحالة */}
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

      {/* منحنى بياني دائري لتوزيع حالات الطلبات */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          توزيع حالات الطلبات
        </h2>
        <Doughnut data={data} />
      </div>

      {/* معلومات إضافية للإدمن */}
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

// البيانات الافتراضية (لأغراض الاختبار)
const statsData: RequestStats = {
  unreadNotifications: 10,
  totalRequests: 100,
  completedRequests: 30,
  pendingRequests: 20,
  inProgressRequests: 15,
  rejectedRequests: 5,
};

const DashboardPage = () => {
  return <DashboardHome stats={statsData} />;
};

export default DashboardPage;
