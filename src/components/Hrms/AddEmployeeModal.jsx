import React, { useState } from "react";
import { addEmployee } from "./api";
import { toast } from "react-toastify";
import { PlusCircle } from "lucide-react";

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    salary: "",
    dob: "",
    address: "",
    isActive: true,
  });
  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    marksheet: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append files if they exist
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      // Debug: Log form data before sending
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await addEmployee(data);
      
      if (response.status === 1) {
        toast.success(response.msg || "Employee added successfully!");
        onClose();
        onEmployeeAdded();
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          department: "",
          designation: "",
          dateOfJoining: "",
          salary: "",
          dob: "",
          address: "",
          isActive: true,
        });
        setFiles({
          aadharFront: null,
          aadharBack: null,
          marksheet: null,
        });
      } else {
        toast.error(response.msg || "Failed to add employee.");
      }
    } catch (error) {
      console.error("Add employee error:", error);
      toast.error(error.message || "An error occurred while adding the employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <PlusCircle size={18} /> Add New Employee
          </h2>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {/* Text Input Fields */}
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "tel" },
              { label: "Department", name: "department", type: "text" },
              { label: "Designation", name: "designation", type: "text" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Address", name: "address", type: "text" },
              { label: "Date of Joining", name: "dateOfJoining", type: "date" },
              { label: "Salary", name: "salary", type: "number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            ))}

            {/* File Upload Fields */}
            {[
              { label: "Aadhar Card (Front)", name: "aadharFront" },
              { label: "Aadhar Card (Back)", name: "aadharBack" },
              { label: "Marksheet/Qualification Proof", name: "marksheet" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type="file"
                  name={field.name}
                  onChange={handleFileChange}
                  className="w-full border rounded p-2"
                  accept="image/*,.pdf"
                />
                {files[field.name] && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {files[field.name].name} (
                    {(files[field.name].size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            ))}
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;