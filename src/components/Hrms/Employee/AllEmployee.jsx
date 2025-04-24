import React, { useEffect, useState } from "react";
import { getEmployeeList } from "../api";
import { ToastContainer } from "react-toastify";
import { PlusCircle } from "lucide-react";
import EmployeeTable from "./EmployeeTable";
import EmployeeCards from "./EmployeeCards";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";

const EmployeeList = () => {
  const [allemployee, setallemployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await getEmployeeList();
      if (res && res.result) {
        setallemployee(res.result);
      } else {
        console.error("Invalid response:", res);
      }
    } catch (error) {
      console.error("Failed to fetch allemployee:", error);
    }
  };

  const totalPages = Math.ceil(allemployee.length / limit);

  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handlePageChange = (type) => {
    if (type === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
    if (type === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const EmployeeList = allemployee.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">View Employees</h1>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500">Total: {allemployee.length} employee(s)</p>
        <button
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Employees
        </button>
      </div>

      {/* Desktop Table View */}
      <EmployeeTable 
        employees={EmployeeList} 
        currentPage={currentPage} 
        limit={limit}
        onEditClick={handleEditClick}
      />

      {/* Mobile Cards View */}
      <EmployeeCards 
        employees={EmployeeList} 
        currentPage={currentPage} 
        limit={limit}
        onEditClick={handleEditClick}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onEmployeeAdded={fetchEmployee}
      />

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <EditEmployeeModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          employee={editingEmployee}
          onEmployeeUpdated={fetchEmployee}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;