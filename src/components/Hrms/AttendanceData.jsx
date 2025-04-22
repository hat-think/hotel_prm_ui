import React, { useState, useEffect } from 'react';
import { getEmployeeList, getAttendance, addattendance } from "./api";
import AttendanceControls from './AttendanceControls';
import AttendanceTable from './AttendanceTable';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import SalarySlipGenerator from './SalarySlipGenerator';

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const AttendancePage = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSalarySlip, setShowSalarySlip] = useState(false);
  const totalDays = getDaysInMonth(selectedMonth, selectedYear);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const empResponse = await getEmployeeList();
        if (empResponse.status !== 1) throw new Error("Failed to fetch employees");
        
        const attResponse = await getAttendance(selectedMonth, selectedYear);
        if (attResponse.status !== 1) throw new Error(attResponse.message || "No attendance data found");

        setEmployees(empResponse.result);
        setAttendanceData(transformAttendanceData(
          empResponse.result,
          attResponse.result, 
          selectedMonth, 
          selectedYear
        ));
        setError(null);
      } catch (err) {
        setError(err.message);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const transformAttendanceData = (employees, apiData, month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const attendanceMap = new Map(apiData.map(record => [record.employeeId, record]));

    return employees.map(employee => {
      const empAttendance = attendanceMap.get(employee.employeeId) || { days: [] };
      const records = Array.from({ length: daysInMonth }, (_, i) => {
        const dayRecord = empAttendance.days.find(d => d.day === i + 1);
        return dayRecord ? dayRecord.status : null;
      });

      return { ...employee, records };
    });
  };

  const handleStatusChange = (empIndex, dayIndex, newStatus) => {
    setAttendanceData(prev => {
      const updated = [...prev];
      updated[empIndex].records[dayIndex] = newStatus;
      return updated;
    });
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(true);
      
      const dataToSave = attendanceData.flatMap(employee => 
        employee.records
          .map((status, index) => status !== null ? {
            employeeId: employee.employeeId,
            status,
            day: index + 1
          } : null)
          .filter(Boolean)
      );

      const response = await addattendance(dataToSave);
      if (response.status !== 1) throw new Error(response.message || "Failed to save attendance");

      setIsEditing(false);
      const [empResponse, attResponse] = await Promise.all([
        getEmployeeList(),
        getAttendance(selectedMonth, selectedYear)
      ]);
      
      setEmployees(empResponse.result);
      setAttendanceData(transformAttendanceData(
        empResponse.result,
        attResponse.result,
        selectedMonth,
        selectedYear
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Attendance</h2>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
            onClick={() => setShowSalarySlip(prev => !prev)}
          >
            {showSalarySlip ? "Hide" : "Show"} Salary Slips
          </button>
          <AttendanceControls
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            loading={loading}
            handleSaveAttendance={handleSaveAttendance}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : attendanceData.length > 0 ? (
        <>
          <AttendanceTable
            attendanceData={attendanceData}
            totalDays={totalDays}
            isEditing={isEditing}
            handleStatusChange={handleStatusChange}
            employees={employees}
          />
          <div className="flex flex-col sm:flex-row gap-3 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1"><CheckCircle2 className="text-green-500 w-4 h-4" /> Present (P)</div>
            <div className="flex items-center gap-1"><Clock className="text-yellow-500 w-4 h-4" /> Half Day (H)</div>
            <div className="flex items-center gap-1"><XCircle className="text-red-500 w-4 h-4" /> Absent (A)</div>
            <div className="flex items-center gap-1"><span className="text-gray-400">-</span> Not Marked</div>
          </div>
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">No employees found</div>
      )}

      {showSalarySlip && (
        <SalarySlipGenerator 
          month={selectedMonth} 
          year={selectedYear} 
        />
      )}
    </div>
  );
};

export default AttendancePage;