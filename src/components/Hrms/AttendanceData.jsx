import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const attendanceData = [
  {
    name: 'Joan Dyer',
    records: Array(31).fill('present').map((val, idx) =>
      [3, 10, 16].includes(idx + 1) ? 'half' : val
    ),
  },
  {
    name: 'Ryan Randall',
    records: Array(31).fill('present').map((val, idx) =>
      [1, 8, 17].includes(idx + 1) ? 'absent' : [13, 14].includes(idx + 1) ? 'half' : val
    ),
  },
  {
    name: 'Phil Glover',
    records: Array(31).fill('present').map((val, idx) =>
      [16, 22].includes(idx + 1) ? 'half' : val
    ),
  },
];

const AttendanceIcon = ({ status }) => {
  if (status === 'present') return <CheckCircle className="text-green-500 w-4 h-4 mx-auto" />;
  if (status === 'half') return <Clock className="text-yellow-500 w-4 h-4 mx-auto" />;
  if (status === 'absent') return <XCircle className="text-red-500 w-4 h-4 mx-auto" />;
  return null;
};

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const AttendanceTable = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const totalDays = getDaysInMonth(selectedMonth, selectedYear);

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
            {attendanceData.map((emp, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium whitespace-nowrap">{emp.name}</td>
                {Array.from({ length: totalDays }, (_, index) => (
                  <td key={index} className="text-center py-2 px-1">
                    <AttendanceIcon status={emp.records[index]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-1"><CheckCircle className="text-green-500 w-4 h-4" /> Full Day Present</div>
        <div className="flex items-center gap-1"><Clock className="text-yellow-500 w-4 h-4" /> Half Day Present</div>
        <div className="flex items-center gap-1"><XCircle className="text-red-500 w-4 h-4" /> Full Day Absence</div>
      </div>
    </div>
  );
};

export default AttendanceTable;
