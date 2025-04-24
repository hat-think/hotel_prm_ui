import React, { useState } from "react";
import { addEmployee } from "../api";
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

  const validateForm = () => {
    // Basic required field validation
    const requiredFields = [
      'name', 'email', 'phone', 'department', 
      'designation', 'dateOfJoining', 'salary', 'dob', 'address'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation (basic 10-digit check)
    if (!/^\d{10,15}$/.test(formData.phone)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      return false;
    }

    // Salary validation
    if (parseFloat(formData.salary) <= 0) {
      toast.error("Salary must be greater than 0");
      return false;
    }

    // File validation (example: make Aadhar front required)
    if (!files.aadharFront) {
      toast.error("Aadhar Card (Front) is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      const response = await addEmployee(data);
      
      if (response.status === 1) {
        toast.success(response.msg || "Employee added successfully!");
        onClose();
        onEmployeeAdded();
        // Reset form
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
          employeephoto: null,

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
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
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
              { label: "Phone", name: "phone", type: "tel", pattern: "[0-9]{10,15}" },
              { label: "Department", name: "department", type: "text" },
              { label: "Designation", name: "designation", type: "text" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Address", name: "address", type: "text" },
              { label: "Date of Joining", name: "dateOfJoining", type: "date" },
              { label: "Salary", name: "salary", type: "number", min: "1" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                  {...(field.pattern && { pattern: field.pattern })}
                  {...(field.min && { min: field.min })}
                />
              </div>
            ))}

            {/* File Upload Fields */}
            {[
              { label: "Aadhar Card (Front)", name: "aadharFront", required: true },
              { label: "Aadhar Card (Back)", name: "aadharBack", required: false },
              { label: "Marksheet/Qualification Proof", name: "marksheet", required: false },
              { label: "Employee photo", name: "employeephoto", required: false },

            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label} 
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="file"
                  name={field.name}
                  onChange={handleFileChange}
                  className="w-full border rounded p-2"
                  accept="image/*,.pdf"
                  required={field.required}
                />
                {files[field.name] && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {files[field.name].name} (
                    {(files[field.name].size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            ))}

            {/* Form Buttons */}
            <div className="p-4 border-t bg-gray-50 mt-4 -mx-6 -mb-6">
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
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Add Employee"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;