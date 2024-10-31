"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { API_BASE_URL } from "@/utils/api";
import DeviceModelForm from "@/components/forms/DeviceModelForm";
import { ClipLoader } from "react-spinners";
import { Switch } from "@mui/material";
import { FiEdit, FiTrash } from "react-icons/fi";
import { confirmAlert } from "react-confirm-alert";
import { DeviceModel } from "@/utils/types";

const DevicesModels: React.FC = () => {
  // State to hold the list of device models
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  // Loading state for data fetching and actions
  const [loading, setLoading] = useState(false);
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for the currently selected model for editing
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);

  // Function to fetch device models from the API
  const fetchDeviceModels = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/device-models`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Fetched Device Models:", response.data.DeviceModel);
      setDeviceModels(response.data.DeviceModel || []); // Update state with fetched data
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
          ? (axiosError.response.data as { message: string }).message
          : "Error occurred while fetching device models.";
      toast.error(errorMessage); // Display error message
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch device models on component mount
  useEffect(() => {
    fetchDeviceModels();
  }, [fetchDeviceModels]);

  // Function to save or update a device model
  const handleSaveModel = async (data: DeviceModel) => {
    try {
      const authToken = Cookies.get("token");
      if (selectedModel) {
        // Update existing model with PUT request
        await axios.put(
          `${API_BASE_URL}/device-models/${selectedModel.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        toast.success("Model updated successfully!");
      } else {
        // Add new model with POST request
        await axios.post(`${API_BASE_URL}/device-models`, data, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        toast.success("New model added successfully!");
      }
      setIsModalOpen(false); // Close modal after save
      fetchDeviceModels(); // Refresh device models list
    } catch (error) {
      toast.error("Error occurred while saving the model.");
    }
  };

  // Open the edit modal with selected model data
  const handleEditModel = (model: DeviceModel) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  // Show confirmation dialog before deleting a model
  const confirmDeleteModel = (id: number) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this service?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteModel(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  // Function to delete a device model
  const handleDeleteModel = async (id: number) => {
    try {
      const authToken = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/device-models/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Model deleted successfully!");
      fetchDeviceModels(); // Refresh list after deletion
    } catch (error) {
      toast.error("Error occurred while deleting the model.");
    }
  };

  // Toggle active status of a device model
  const handleToggleActive = async (model: DeviceModel) => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const isActiveValue = model.isActive ? "false" : "true";

      await axios.put(
        `${API_BASE_URL}/device-models/${model.id}`,
        { isActive: isActiveValue },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Service status updated successfully!");
      fetchDeviceModels();
    } catch (error) {
      toast.error("Error occurred while updating the service status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Device Models</h2>

      <button
        onClick={() => {
          setSelectedModel(null);
          setIsModalOpen(true); // Open modal for adding a new model
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New Model
      </button>

      {/* Display loading spinner while fetching data */}
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#4A90E2" loading={loading} size={50} />
        </div>
      ) : (
        <ul className="mt-4">
          {/* Map through device models list */}
          {deviceModels.length > 0 ? (
            deviceModels.map((model) => (
              <li
                key={model.id}
                className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 p-4 border rounded shadow"
              >
                <div>
                  <h3 className="text-lg font-semibold">{model.title}</h3>
                  <p className="text-sm text-gray-600">
                    Status: {model.isActive ? "Active" : "Inactive"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created At:{" "}
                    {model.createAt
                      ? new Date(model.createAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        model.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <Switch
                      checked={model.isActive}
                      onChange={() => handleToggleActive(model)}
                      color="primary"
                    />
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <button
                    className="ml-4"
                    onClick={() => handleEditModel(model)}
                    disabled={loading}
                  >
                    <FiEdit className="text-yellow-500 text-xl " />
                  </button>
                  <button
                    onClick={() => confirmDeleteModel(model.id)}
                    disabled={loading}
                  >
                    <FiTrash className="text-red-500 text-xl" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">
              No device models available currently.
            </p>
          )}
        </ul>
      )}

      {/* Modal for adding or editing a device model */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          ariaHideApp={false}
          className="rounded shadow-lg"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <DeviceModelForm
            onSubmit={handleSaveModel}
            onClose={() => setIsModalOpen(false)}
            initialData={selectedModel} // Pass selected model data if editing
            services={selectedModel?.services || []} // Pass services data
          />
        </Modal>
      )}
    </div>
  );
};

export default DevicesModels;
