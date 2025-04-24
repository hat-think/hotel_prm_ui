import React, { useState } from "react";
import {
  Download,
  User,
  Search,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  X,
} from "lucide-react";

const AttendanceBar = ({ present, half, total }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-green-500 h-2.5 rounded-full"
      style={{ width: `${(present / total) * 100}%` }}
    ></div>
    <div
      className="bg-yellow-400 h-2.5 rounded-full -mt-2.5"
      style={{
        width: `${(half / total) * 100}%`,
        marginLeft: `${(present / total) * 100}%`,
      }}
    ></div>
  </div>
);

const SalarySlipList = ({
  month,
  year,
  loading,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  salaryView,
  setSalaryView,
  previewSlip,
  sortConfig,
  requestSort,
  expandedRows,
  toggleRow,
  filteredSlips,
  totalDays,
  summaryStats,
  handleDownloadCSV,
  handleDownloadAllSlips,
  handleDownloadReport,
  handleDownloadIndividualSlip,
  handlePreviewSlip,
  closePreview,
  clearSearch,
  formatCurrency,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSlips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSlips.length / itemsPerPage);
  const getLastSixChars = (id) => {
    if (!id || id.length <= 6) return id;
    return id.slice(-6); // Get last 6 characters
  };
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Salary Slips -{" "}
            {new Date(year, month - 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p className="text-sm text-gray-500">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Enhanced Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, department or designation..."
              className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button
                onClick={() =>
                  setSalaryView(salaryView === "monthly" ? "yearly" : "monthly")
                }
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                {salaryView === "monthly" ? "Yearly" : "Monthly"}
                {sortConfig.direction === "asc" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
            </div>

            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "card" : "table")
              }
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
            >
              <User className="h-4 w-4" />
              {viewMode === "table" ? "Cards" : "Table"}
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <button
                  onClick={handleDownloadCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  CSV
                </button>
                <button
                  onClick={
                    viewMode === "table"
                      ? handleDownloadReport
                      : handleDownloadAllSlips
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {viewMode === "table" ? "PDF Report" : "All Slips (ZIP)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center">
          <Search className="h-4 w-4 text-blue-500 mr-2" />
          <span className="text-sm text-blue-700">
            Showing {filteredSlips.length} result
            {filteredSlips.length !== 1 ? "s" : ""} for "{searchTerm}"
          </span>
          <button
            onClick={clearSearch}
            className="ml-auto text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            Clear search
            <X className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
          <p className="text-2xl font-semibold">
            {summaryStats.totalEmployees}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">
            Baby
          </h3>
          {/* <p className="text-2xl font-semibold">
            {formatCurrency(summaryStats.totalBaseSalary)}
          </p> */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">
          Baby
          </h3>
          {/* <p className="text-2xl font-semibold">
            {formatCurrency(summaryStats.totalNetSalary)}
          </p> */}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Table View */}
      {!loading && viewMode === "table" && currentItems.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center">
                        Employee
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        requestSort(
                          salaryView === "monthly"
                            ? "calculatedMonthly"
                            : "calculatedYearly"
                        )
                      }
                    >
                      <div className="flex items-center justify-end">
                        Net {salaryView === "monthly" ? "Monthly" : "Yearly"}{" "}
                        Pay
                        {sortConfig.key ===
                          (salaryView === "monthly"
                            ? "calculatedMonthly"
                            : "calculatedYearly") &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((slip) => {
                    const calculatedSalary =
                      salaryView === "monthly"
                        ? slip.calculatedMonthly
                        : slip.calculatedYearly;
                    const isExpanded = expandedRows.includes(slip.employeeId);

                    return (
                      <React.Fragment key={slip.employeeId}>
                        <tr
                          className={`hover:bg-gray-50 ${
                            calculatedSalary === 0 ? "bg-red-50" : ""
                          }`}
                          onClick={() => toggleRow(slip.employeeId)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
  <img 
    src={`https://log.tokame.network/${slip.employeephoto}`} 
    alt={slip.name}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.onerror = null; // Prevent infinite loop
      e.target.src = '/default-avatar.jpg';
    }}
  />
</div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {slip.name}
                                </div>
                                <div className="text-sm">
                                  <span className="font-mono bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded">
                                    Emp.Id : {getLastSixChars(slip.employeeId)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-green-600">
                                  {slip.presentDays} Present
                                </span>
                                <span className="text-yellow-600">
                                  {slip.halfDays} Half
                                </span>
                                <span className="text-red-600">
                                  {slip.absentDays} Absent
                                </span>
                              </div>
                              <AttendanceBar
                                present={slip.presentDays}
                                half={slip.halfDays}
                                absent={slip.absentDays}
                                total={totalDays}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span
                              className={`font-semibold ${
                                calculatedSalary === 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {formatCurrency(calculatedSalary)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreviewSlip(slip);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                title="Preview"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadIndividualSlip(slip);
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Download"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan="4" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded shadow border border-gray-200">
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                                    Salary Details
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Base Salary:</span>
                                      <span>
                                        {formatCurrency(
                                          salaryView === "monthly"
                                            ? slip.baseSalaryMonthly
                                            : slip.baseSalaryYearly
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Daily Rate:</span>
                                      <span>
                                        {formatCurrency(slip.dailySalary)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Department:</span>
                                      <span>{slip.department || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Designation:</span>
                                      <span>{slip.designation || "N/A"}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-4 rounded shadow border border-gray-200">
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                                    Attendance Breakdown
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-green-600">
                                        Present Days:
                                      </span>
                                      <span>{slip.presentDays}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-yellow-600">
                                        Half Days:
                                      </span>
                                      <span>{slip.halfDays}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-red-600">
                                        Absent Days:
                                      </span>
                                      <span>{slip.absentDays}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                      <span>Total Days:</span>
                                      <span>{totalDays}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-4 rounded shadow border border-gray-200">
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                                    Calculation
                                  </h4>
                                  <div className="text-xs text-gray-500">
                                    ({slip.presentDays} × full day) + (
                                    {slip.halfDays} × 0.5 day) ={" "}
                                    {slip.presentDays + slip.halfDays * 0.5}{" "}
                                    effective days
                                    <div className="mt-2 text-sm">
                                      Daily rate:{" "}
                                      {formatCurrency(slip.dailySalary)}
                                      <br />
                                      {salaryView === "monthly"
                                        ? "Monthly"
                                        : "Yearly"}{" "}
                                      pay: {formatCurrency(calculatedSalary)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredSlips.length)} of{" "}
              {filteredSlips.length} entries
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Card View */}
      {!loading && viewMode === "card" && currentItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((slip) => {
              const calculatedSalary =
                salaryView === "monthly"
                  ? slip.calculatedMonthly
                  : slip.calculatedYearly;
              const baseSalary =
                salaryView === "monthly"
                  ? slip.baseSalaryMonthly
                  : slip.baseSalaryYearly;

              return (
                <div
                  key={slip.employeeId}
                  className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                          {slip.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {slip.name}
                          </h3>
                          <p className="text-sm text-gray-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded">
                            Emp.Id : {getLastSixChars(slip.employeeId)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handlePreviewSlip(slip)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Preview"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadIndividualSlip(slip)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Download"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Attendance:</span>
                        <div className="flex space-x-2">
                          <span className="text-green-600">
                            {slip.presentDays}P
                          </span>
                          <span className="text-yellow-600">
                            {slip.halfDays}H
                          </span>
                          <span className="text-red-600">
                            {slip.absentDays}A
                          </span>
                        </div>
                      </div>
                      <AttendanceBar
                        present={slip.presentDays}
                        half={slip.halfDays}
                        absent={slip.absentDays}
                        total={totalDays}
                      />
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Base Salary:</span>
                        <span className="font-medium">
                          {formatCurrency(baseSalary)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Net Pay:</span>
                        <span
                          className={`text-lg font-bold ${
                            calculatedSalary === 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {formatCurrency(calculatedSalary)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredSlips.length)} of{" "}
              {filteredSlips.length} entries
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && filteredSlips.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
            {searchTerm ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {searchTerm ? "No employees found" : "No salary data available"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? `No results found for "${searchTerm}"`
              : "No employees match the current criteria"}
          </p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Salary Slip Preview</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div
              className="p-4"
              dangerouslySetInnerHTML={{ __html: previewSlip }}
            />
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => {
                  const blob = new Blob([previewSlip], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  window.open(url, "_blank");
                }}
                className="bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
              >
                Open in New Tab
              </button>
              <button
                onClick={() => {
                  const printWindow = window.open("", "_blank");
                  printWindow.document.write(previewSlip);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySlipList;
