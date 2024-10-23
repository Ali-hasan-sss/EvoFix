import React from "react";
import { RepairRequest } from "../../../utils/types";
import RepairRequestCard from "@/components/RepairRequestCard";

interface AvailableRequestsProps {
  repairRequests: RepairRequest[];
  statusMap: { [key: string]: string };
  userRole: "TECHNICIAN"; // تمرير الدور الحالي
  onRequestUpdated: () => void;
}

const AvailableRequests: React.FC<AvailableRequestsProps> = ({
  repairRequests,
  statusMap,
  userRole, // تمرير userRole كـ prop
  onRequestUpdated,
}) => {
  return (
    <div
      className="w-full flex-grow grid gap-4 overflow-y-auto"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {repairRequests.map(
        (request) =>
          request.user ? ( // تحقق من وجود user قبل عرض الكارد
            <RepairRequestCard
              key={request.id}
              request={request}
              statusMap={statusMap} // تمرير statusMap
              userRole={userRole} // تمرير userRole من الخصائص
              onRequestUpdated={onRequestUpdated} // تمرير onRequestUpdated
            />
          ) : null // إذا لم يكن هناك user، لا تعرض الكارد
      )}
    </div>
  );
};

export default AvailableRequests;
