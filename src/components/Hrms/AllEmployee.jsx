import React, { useEffect, useState } from "react";
import { getEmployeeList, updateEmployee, addEmployee } from "./api"; // Make sure to add addEmployee to your API
import { ToastContainer, toast } from "react-toastify";
import {
  BedDouble,
  Building2,
  UserRoundCog,
  IndianRupee,
  Users,
  CheckCircle,
  XCircle,
  Hash,
  PencilLine,
  PlusCircle,
} from "lucide-react";

const AllEmployee = () => {
  const [allemployee, setallemployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Form state for editing
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  // Form state for adding new employee
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

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewEmployee({
      name: "",
      employeeId: "",
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
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addEmployee(newEmployee);
      if (response.status === 1) {
        toast.success(response.msg || "Employee added successfully!");
        handleAddModalClose();
        fetchEmployee();
        toast.error(response.msg || "Failed to add employee.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the employee.");
      console.error("Add employee error:", error);
    }
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setEditName(employee.name);
    setEditPhone(employee.phone);
    setEditDepartment(employee.department);
    setEditDesignation(employee.designation);
    setEditSalary(employee.salary);
    setEditIsActive(employee.isActive);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      employeeId: editingEmployee.employeeId,
      name: editName,
      phone: editPhone,
      department: editDepartment,
      designation: editDesignation,
      salary: Number(editSalary),
      isActive: editIsActive,
    };

    const res = await updateEmployee(updatedEmployee); // Make sure you have this API function
    if (res.status) {
      toast.success("Employee updated successfully!");
      handleModalClose();
      fetchEmployee(); // refresh list
    } else {
      toast.error("Failed to update employee.");
    }
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

      {/* Table View */}
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
                <PencilLine size={16} className="inline mr-1" /> Qrcode
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {EmployeeList.map((Employee, index) => (
              <tr key={Employee._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">
                  #{index + 1 + (currentPage - 1) * limit}
                </td>
                <td className="px-6 py-4">{Employee.name}</td>
                <td className="px-6 py-4">{Employee.phone}</td>
                <td className="px-6 py-4">{Employee.department}</td>
                <td className="px-6 py-4">{Employee.designation}</td>
                <td className="px-6 py-4">{Employee.salary}</td>
                <td className="px-6 py-4">
                  {Employee.isActive ? (
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
                  {Employee.isActive ? (
                    <button
                      onClick={() => handleEditClick(Employee)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
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
              <form
                onSubmit={handleAddEmployeeSubmit}
                className="grid grid-cols-1 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Salary
                  </label>
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
                  onClick={handleAddModalClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddEmployeeSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
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
                  onClick={handleModalClose}
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
      )}

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-2">
        {EmployeeList.map((Employee, index) => (
          <div
            key={Employee._id}
            className="bg-white border rounded-lg p-4 shadow-sm text-sm"
          >
            <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
              <div>
                <span className="font-medium">
                  #{index + 1 + (currentPage - 1) * limit}
                </span>
                {Employee.name}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {Employee.phone}
              </div>
              <div>
                <span className="font-medium">Department:</span>{" "}
                {Employee.department}
              </div>
              <div>
                <span className="font-medium">Designation:</span>{" "}
                {Employee.designation}
              </div>
              <div>
                <span className="font-medium">salary:</span> {Employee.salary}
              </div>
              <div className="text-red-600 font-medium flex items-center gap-4">
                <span className="font-medium">Active:</span>
                {Employee.isActive ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-red-600 font-medium">No</span>
                )}

                <button
                  onClick={() => handleEditClick(Employee)}
                  className={`font-medium hover:underline ${
                    Employee.isActive ? "text-blue-600" : "text-blue-100"
                  }`}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default AllEmployee;
