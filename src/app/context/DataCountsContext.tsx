"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";

// Define the type for the counts object
interface DataCounts {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  inProgressRequests: number;
  rejectedRequests: number;
  assignedRequests: number;
  quotedRequests: number;
  faqCount: number;
  notifications: number;
  activationRequests: number;
}
interface Notification {
  title: string;
  isRead: boolean;
}

// Create a context to hold the counts
const DataCountsContext = createContext<DataCounts | null>(null);
export const DataCountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [counts, setCounts] = useState<DataCounts>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    inProgressRequests: 0,
    rejectedRequests: 0,
    assignedRequests: 0,
    quotedRequests: 0,
    faqCount: 0,
    notifications: 0,
    activationRequests: 0,
  });

  const fetchCounts = async () => {
    try {
      const token = Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all requests counts from the new single endpoint
      const requestsResponse = await axios.get(
        `${API_BASE_URL}/maintenance-requests/count`,
        { headers }
      );

      // Fetch all notifications
      const notificationsResponse = await axios.get(
        `${API_BASE_URL}/notifications`,
        { headers }
      );
      // Fetch the notifications count
      const notificationsCountResponse = await axios.get(
        `${API_BASE_URL}/notifications/count`,
        { headers }
      );
      // Extract actual notifications count from the response
      const notificationsCount = notificationsCountResponse.data.count;

      // Count the activation requests that have "طلب تفعيل حساب تقني" as the title and are unread
      const activationRequestsCount = notificationsResponse.data.filter(
        (notification: Notification) =>
          notification.title === "طلب تفعيل حساب تقني" && !notification.isRead
      ).length;

      // Update counts based on the new response structure
      setCounts({
        totalRequests: requestsResponse.data.AllRequests,
        pendingRequests: requestsResponse.data.Pending,
        completedRequests: requestsResponse.data.Complete,
        inProgressRequests: requestsResponse.data.InProgress,
        rejectedRequests: requestsResponse.data.Reject,
        assignedRequests: requestsResponse.data.Assign,
        quotedRequests: requestsResponse.data.Quoted,
        faqCount: requestsResponse.data.FAQ, // No change for FAQ count in this example
        notifications: notificationsCount, // Use the extracted notifications count
        activationRequests: activationRequestsCount,
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
