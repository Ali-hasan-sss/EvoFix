"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
// Define the type for the counts object
interface DataCounts {
  totalRequests: number;
  pendingRequests: number;
  assignedRequests: number;
  completedRequests: number;
  inProgressRequests: number;
  rejectedRequests: number;
  quotedRequests: number;
  faqCount: number;
  notifications: number;
}
// Create a context to hold the counts
const DataCountsContext = createContext<DataCounts | null>(null);
export const DataCountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [counts, setCounts] = useState<{
    totalRequests: number;
    pendingRequests: number;
    assignedRequests: number;
    completedRequests: number;
    inProgressRequests: number;
    rejectedRequests: number;
    quotedRequests: number;
    faqCount: number;
    notifications: number;
  }>({
    totalRequests: 0,
    pendingRequests: 0,
    assignedRequests: 0,
    completedRequests: 0,
    inProgressRequests: 0,
    rejectedRequests: 0,
    quotedRequests: 0,
    faqCount: 0,
    notifications: 0,
  });

  const fetchCounts = async () => {
    try {
      const token = Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };

      const requestsEndpoints = [
        "/maintenance-requests/count",
        "/maintenance-requests/count/pending",
        "/maintenance-requests/count/assign",
        "/maintenance-requests/count/completed",
        "/maintenance-requests/count/inProgress",
        "/maintenance-requests/count/rejected",
        "/maintenance-requests/count/quoted",
        "/fAQ/count",
        "/notifications/count",
      ];

      // Fetch counts from all endpoints concurrently
      const responses = await Promise.all(
        requestsEndpoints.map((endpoint) =>
          axios.get(`${API_BASE_URL}${endpoint}`, { headers })
        )
      );

      // Update counts based on the responses
      setCounts({
        totalRequests: responses[0].data.count?.message
          ? 0
          : responses[0].data.count,
        pendingRequests: responses[1].data.count?.message
          ? 0
          : responses[1].data.count,
        assignedRequests: responses[2].data.count?.message
          ? 0
          : responses[2].data.count,
        completedRequests: responses[3].data.count?.message
          ? 0
          : responses[3].data.count,
        inProgressRequests: responses[4].data.count?.message
          ? 0
          : responses[4].data.count,
        rejectedRequests: responses[5].data.count?.message
          ? 0
          : responses[5].data.count,
        quotedRequests: responses[6].data.count?.message
          ? 0
          : responses[6].data.count,
        faqCount: responses[7].data.count?.message
          ? 0
          : responses[7].data.count,
        notifications: responses[8].data.count?.message
          ? 0
          : responses[8].data.count,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <DataCountsContext.Provider value={counts}>
      {children}
    </DataCountsContext.Provider>
  );
};

// Custom hook to use the counts in other components
export const useDataCounts = () => {
  return useContext(DataCountsContext);
};

export default DataCountsProvider;
