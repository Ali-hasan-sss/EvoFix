import React from "react";

interface Request {
  id: string;
  deviceName: string;
  deviceType: string;
  issueDescription: string;
  status: string;
}

interface AvailableRequestsProps {
  repairRequests: Request[];
  handleAssignRequest: (id: string) => void;
}

const AvailableRequests: React.FC<AvailableRequestsProps> = ({
  repairRequests,
  handleAssignRequest,
}) => {
  return (
    <div
      className="w-full flex-grow grid gap-4 overflow-y-auto"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {repairRequests.map((request) => (
        <div key={request.id} className="border rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">{request.deviceName}</h2>
          <p>
            <strong>نوع الجهاز:</strong> {request.deviceType}
          </p>
          <p>
            <strong>وصف العطل:</strong> {request.issueDescription}
          </p>
          <p>
            <strong>الحالة:</strong> {request.status}
          </p>
          <button
            onClick={() => handleAssignRequest(request.id)}
            className="mt-4 py-2 px-4 rounded bg-green-500 text-white hover:bg-green-400"
          >
            استلام المهمة
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailableRequests;
