import React from "react";
import { RepairRequest } from "../../../utils/types";
import RepairRequestCard from "@/components/RepairRequestCard";

interface AvailableRequestsProps {
  repairRequests: RepairRequest[];
  statusMap: { [key: string]: string };
  userRole: "TECHNICIAN";
  onRequestUpdated: () => void;
}

const AvailableRequests: React.FC<AvailableRequestsProps> = ({
  repairRequests,
  statusMap,
  userRole,
  onRequestUpdated,
}) => {
  return (
    <div
      className="w-full flex-grow grid gap-4 overflow-y-auto"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {repairRequests.map((request) =>
        request.user ? (
          <RepairRequestCard
            key={request.id}
            request={request}
            statusMap={statusMap}
            userRole={userRole}
            onRequestUpdated={onRequestUpdated}
          />
        ) : null
      )}
    </div>
  );
};

export default AvailableRequests;
