import React, { useState } from "react";
import { updateEmployee } from "../api";
import { toast } from "react-toastify";
import { UserRoundCog } from "lucide-react";

const EditEmployeeModal = ({ isOpen, onClose, employee, onEmployeeUpdated }) => {
  const [editName, setEditName] = useState(employee.name);
  const [editPhone, setEditPhone] = useState(employee.phone);
  const [editDepartment, setEditDepartment] = useState(employee.department);
  const [editDesignation, setEditDesignation] = useState(employee.designation);
  const [editSalary, setEditSalary] = useState(employee.salary);
  const [editIsActive, setEditIsActive] = useState(employee.isActive);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      employeeId: employee.employeeId,
      name: editName,
      phone: editPhone,
      department: editDepartment,
      designation: editDesignation,
      salary: Number(editSalary),
      isActive: editIsActive,
    };

    const res = await updateEmployee(updatedEmployee);
    if (res.status) {
      toast.success("Employee updated successfully!");
      onClose();
      onEmployeeUpdated();
    } else {
      toast.error("Failed to update employee.");
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-white sticky top-0 z-10 flex items-center gap-2">
          <UserRoundCog className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Employee Details
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-5">
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Management">Management</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editSalary}
                onChange={(e) => setEditSalary(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center gap-6 mt-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    checked={editIsActive === true}
                    onChange={() => setEditIsActive(true)}
                  />
                  Active
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    className="form-radio text-red-600"
                    checked={editIsActive === false}
                    onChange={() => setEditIsActive(false)}
                  />
                  Inactive
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 sticky bottom-0 z-10">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;