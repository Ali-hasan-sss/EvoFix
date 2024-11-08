"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";

// Define the type for the counts object, representing different data counts in the application
interface DataCounts {
  totalRequests: number; // Total number of maintenance requests
  pendingRequests: number; // Count of pending maintenance requests
  completedRequests: number; // Count of completed maintenance requests
  inProgressRequests: number; // Count of requests currently in progress
  rejectedRequests: number; // Count of rejected requests
  assignedRequests: number; // Count of requests that have been assigned
  quotedRequests: number; // Count of requests that have been quoted
  faqCount: number; // FAQ count for the system
  notifications: number; // Total number of notifications
  activationRequests: number; // Count of unread technician activation requests
  fetchCounts?: () => Promise<void>; // Optional function to fetch the counts
}

interface Notification {
  title: string; // Notification title to identify specific notifications
  isRead: boolean; // Boolean to track if the notification has been read
}

// Create a context to provide counts data across the app
const DataCountsContext = createContext<DataCounts | null>(null);

// Provider component to fetch and manage counts data, sharing it with children components
export const DataCountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize counts state with default values
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

  // Function to fetch counts from the API and update the state
  const fetchCounts = async () => {
    try {
      const token = Cookies.get("token"); // Get authentication token from cookies
      const headers = { Authorization: `Bearer ${token}` }; // Set headers with token

      // Fetch the counts for maintenance requests
      const requestsResponse = await axios.get(
        `${API_BASE_URL}/maintenance-requests/count`,
        { headers }
      );

      // Fetch notifications to process specific notifications like activation requests
      const notificationsResponse = await axios.get(
        `${API_BASE_URL}/notifications`,
        { headers }
      );

      // Fetch the total count of notifications
      const notificationsCountResponse = await axios.get(
        `${API_BASE_URL}/notifications/count`,
        { headers }
      );
      const notificationsCount = notificationsCountResponse.data.count; // Extract notification count

      // Filter unread activation requests for technicians
      const activationRequestsCount = notificationsResponse.data.filter(
        (notification: Notification) =>
          notification.title === "طلب تفعيل حساب تقني" && !notification.isRead
      ).length;

      // Update the state with fetched data
      setCounts({
        totalRequests: requestsResponse.data.AllRequests,
        pendingRequests: requestsResponse.data.Pending,
        completedRequests: requestsResponse.data.Complete,
        inProgressRequests: requestsResponse.data.InProgress,
        rejectedRequests: requestsResponse.data.Reject,
        assignedRequests: requestsResponse.data.Assign,
        quotedRequests: requestsResponse.data.Quoted,
        faqCount: requestsResponse.data.FAQ,
        notifications: notificationsCount,
        activationRequests: activationRequestsCount,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // Fetch counts initially and set an interval to refresh counts every minute
  useEffect(() => {
    fetchCounts(); // Initial fetch
    const interval = setInterval(fetchCounts, 60000); // Set interval for refreshing counts every 60 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Provide counts and the fetchCounts function to children components via context
  return (
    <DataCountsContext.Provider value={{ ...counts, fetchCounts }}>
      {children}
    </DataCountsContext.Provider>
  );
};

// Custom hook to access counts context in other components
export const useDataCounts = () => {
  return useContext(DataCountsContext);
};

export default DataCountsProvider;
