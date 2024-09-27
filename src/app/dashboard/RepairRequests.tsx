import React from "react";
import GenericTable from "@/components/dashboard/GenericTable";
const RepairRequests = () => {
  const repairRequests = [
    {
      id: 1,
      deviceType: "هاتف",
      issueDescription: "شاشة مكسورة",
      status: "قيد التنفيذ",
      technicianName: "علي حسن",
      cost: 150,
    },
    {
      id: 2,
      deviceType: "لابتوب",
      issueDescription: "لا يعمل",
      status: "منفذ",
      technicianName: "فاطمة علي",
      cost: 300,
    },
    {
      id: 3,
      deviceType: "تابلت",
      issueDescription: "شاشة غير مستجيبة",
      status: "لم يتم الاستلام بعد",
      technicianName: "أحمد سعيد",
      cost: 200,
    },
  ];

  const columns = [
    { title: "رقم الطلب", accessor: "id" },
    { title: "نوع الجهاز", accessor: "deviceType" },
    { title: "وصف العطل", accessor: "issueDescription" },
    { title: "الحالة", accessor: "status" },
    { title: "اسم الفني", accessor: "technicianName" },
    { title: "الكلفة", accessor: "cost" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">طلبات الإصلاح</h1>
      <GenericTable data={repairRequests} columns={columns} />
    </div>
  );
};

export default RepairRequests;
