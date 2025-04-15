import React, { useState } from "react";
import {
  Building2,
  UserRoundCog,
  IndianRupee,
  Users,
  CheckCircle,
  XCircle,
  Hash,
  PencilLine,
  QrCode,
} from "lucide-react";
import QrModal from "./QrModal";

const EmployeeTable = ({ employees, currentPage, limit, onEditClick }) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleQrClick = (employee) => {
    setSelectedEmployee(employee);
    setQrModalOpen(true);
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <>
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200 hidden md:block">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">
                <Hash size={16} className="inline mr-1" /> ID
              </th>
              <th className="px-6 py-3">
                <Users size={16} className="inline mr-1" /> Name
              </th>
              <th className="px-6 py-3">
                <Building2 size={16} className="inline mr-1" /> Phone
              </th>
              <th className="px-6 py-3">
                <IndianRupee size={16} className="inline mr-1" /> Department
              </th>
              <th className="px-6 py-3">
                <PencilLine size={16} className="inline mr-1" /> Designation
              </th>
              <th className="px-6 py-3">
                <IndianRupee size={16} className="inline mr-1" /> Salary
              </th>
              <th className="px-6 py-3">
                <CheckCircle size={16} className="inline mr-1" /> Active
              </th>
              <th className="px-6 py-3">
                <PencilLine size={16} className="inline mr-1" /> Edit
              </th>
              <th className="px-6 py-3">
                <QrCode size={16} className="inline mr-1" /> QR Code
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr key={employee._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">
                  #{index + 1 + (currentPage - 1) * limit}
                </td>
                <td className="px-6 py-4">{employee.name}</td>
                <td className="px-6 py-4">{employee.phone}</td>
                <td className="px-6 py-4">{employee.department}</td>
                <td className="px-6 py-4">{employee.designation}</td>
                <td className="px-6 py-4">{employee.salary}</td>
                <td className="px-6 py-4">
                  {employee.isActive ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle size={14} /> Yes
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <XCircle size={14} /> No
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {employee.isActive ? (
                    <button
                      onClick={() => onEditClick(employee)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="text-blue-100 hover:underline cursor-pointer">
                      Edit
                    </button>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleQrClick(employee)}
                    className="text-purple-600 hover:underline cursor-pointer flex items-center justify-center gap-1"
                  >
                    <QrCode size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Code Modal */}
      <QrModal
        isOpen={qrModalOpen}
        onClose={closeQrModal}
        employee={selectedEmployee}
      />
    </>
  );
};

export default EmployeeTable;