import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { getAttendance } from "./api";

const AttendanceIcon = ({ status }) => {
  if (status === 1) return <CheckCircle className="text-green-500 w-4 h-4 mx-auto" />;
  if (status === 2) return <Clock className="text-yellow-500 w-4 h-4 mx-auto" />;
  if (status === 0) return <XCircle className="text-red-500 w-4 h-4 mx-auto" />;
  return <span className="text-gray-400 w-4 h-4 mx-auto">-</span>;
};

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const transformAttendanceData = (apiData, month, year) => {
  const daysInMonth = getDaysInMonth(month, year);
  
  // Group records by employeeId
  const employeesMap = new Map();
  
  apiData.forEach(record => {
    if (record.month === month && record.year === year) {
      if (!employeesMap.has(record.employeeId)) {
        employeesMap.set(record.employeeId, {
          employeeId: record.employeeId,
          name: record.employeeId, // Replace with actual name if available
          records: Array(daysInMonth).fill(null) // Initialize with null for unmarked days
        });
      }
      
      // Update the records for each day
      record.days.forEach(dayRecord => {
        const employee = employeesMap.get(record.employeeId);
        employee.records[dayRecord.day - 1] = dayRecord.status;
      });
    }
  });
  
  return Array.from(employeesMap.values());
};

const AttendanceTable = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalDays = getDaysInMonth(selectedMonth, selectedYear);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await getAttendance(selectedMonth, selectedYear);
        if (response.status === 1) {
          const transformedData = transformAttendanceData(response.result, selectedMonth, selectedYear);
          setAttendanceData(transformedData);
          setError(null);
        } else {
          throw new Error(response.message || "No attendance data found");
        }
      } catch (err) {
        setError(err.message);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  // ... [rest of the component remains the same until the return statement]

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Attendance</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[2023, 2024, 2025].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
          <button className="bg-black text-white px-3 py-1 rounded text-sm">Edit Attendance</button>
          <button className="bg-purple-700 text-white px-3 py-1 rounded text-sm">Filter ▼</button>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="min-w-max w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 whitespace-nowrap">Employee</th>
              {Array.from({ length: totalDays }, (_, i) => (
                <th key={i + 1} className="text-center px-2 py-2 whitespace-nowrap">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((emp, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">{emp.name}</td>
                  {Array.from({ length: totalDays }, (_, index) => (
                    <td key={index} className="text-center py-2 px-1">
                      <AttendanceIcon status={emp.records[index]} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={totalDays + 1} className="text-center py-4 text-gray-500">
                  {error || "No attendance data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-1"><CheckCircle className="text-green-500 w-4 h-4" /> Present (1)</div>
        <div className="flex items-center gap-1"><Clock className="text-yellow-500 w-4 h-4" /> Half Day (2)</div>
        <div className="flex items-center gap-1"><XCircle className="text-red-500 w-4 h-4" /> Absent (0)</div>
        <div className="flex items-center gap-1"><span className="text-gray-400">-</span> Not Marked</div>
      </div>
    </div>
  );
};

export default AttendanceTable;