import React, { useState } from "react";
import { addEmployee } from "./api";
import { toast } from "react-toastify";
import { PlusCircle } from "lucide-react";

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [newEmployee, setNewEmployee] = useState({
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

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addEmployee(newEmployee);
      if (response.status === 1) {
        toast.success(response.msg || "Employee added successfully!");
        onClose();
        onEmployeeAdded();
      } else {
        toast.error(response.msg || "Failed to add employee.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the employee.");
      console.error("Add employee error:", error);
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
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={newEmployee.phone}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={newEmployee.department}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={newEmployee.designation}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of birth
              </label>
              <input
                type="date"
                name="dob"
                value={newEmployee.dob}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={newEmployee.address}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Joining
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={newEmployee.dateOfJoining}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Salary</label>
              <input
                type="number"
                name="salary"
                value={newEmployee.salary}
                onChange={handleNewEmployeeChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;