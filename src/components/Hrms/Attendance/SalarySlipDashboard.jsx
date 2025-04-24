import React, { useEffect, useState, useMemo } from 'react';
import { getEmployeeList, getAttendance } from '../api';
import SalarySlipList from './SalarySlipList';
import { generateSalarySlipHTML, generateSalaryReportHTML } from './SalarySlipTemplate';
import { downloadHTMLAsFile, downloadCSV, downloadAllSlipsAsZip } from './FileDownloadUtils';

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const SalarySlipContainer = ({ month, year }) => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [totalDays, setTotalDays] = useState(getDaysInMonth(month, year));
  const [salaryView, setSalaryView] = useState('monthly');
  const [previewSlip, setPreviewSlip] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState([]);

  // Fetch data
  useEffect(() => {
    setTotalDays(getDaysInMonth(month, year));
  }, [month, year]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        const [empResponse, attResponse] = await Promise.all([
          getEmployeeList(),
          getAttendance(month, year),
        ]);

        if (empResponse.status !== 1 || attResponse.status !== 1) {
          throw new Error('Failed to fetch employee or attendance data.');
        }

        const slips = empResponse.result.map(emp => {
          const attendanceRecord = attResponse.result.find(
            a => a.employeeId === emp.employeeId
          ) || { days: [] };
        
          const presentDays = attendanceRecord.days.filter(r => r.status === 1).length;
          const halfDays = attendanceRecord.days.filter(r => r.status === 2).length;
          const absentDays = totalDays - (presentDays + halfDays);
        
          // Yearly salary is the employee's base salary
          const baseSalaryYearly = emp.salary;
          
          // Monthly salary is yearly divided by 12
          const baseSalaryMonthly = (baseSalaryYearly / 12).toFixed(2);
          
          // Daily salary is monthly divided by working days in month (typically 22-26)
          // Assuming standard 22 working days per month
          const workingDaysPerMonth = 22;
          const dailySalary = baseSalaryMonthly / workingDaysPerMonth;
          
          // Calculate actual monthly pay based on attendance
          const effectiveWorkingDays = presentDays + (halfDays * 0.5);
          const calculatedMonthly = (dailySalary * effectiveWorkingDays).toFixed(2);
          
          // Calculate actual yearly pay
          const calculatedYearly = (calculatedMonthly * 12).toFixed(2);
        
          return {
            name: emp.name,
            employeeId: emp.employeeId,
            department: emp.department,
            designation: emp.designation,
            employeephoto: emp.Employeephoto,
            presentDays,
            halfDays,
            absentDays,
            baseSalaryMonthly,
            baseSalaryYearly,
            calculatedMonthly: parseFloat(calculatedMonthly),
            calculatedYearly: parseFloat(calculatedYearly),
            dailySalary: dailySalary.toFixed(2)
          };
        });

        setSalarySlips(slips);
      } catch (err) {
        console.error(err);
        setSalarySlips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [month, year, totalDays]);

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort employees
  const filteredSlips = useMemo(() => {
    let sortableItems = [...salarySlips];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter(slip => 
        slip.name.toLowerCase().includes(term) || 
        slip.employeeId.toLowerCase().includes(term) ||
        (slip.department && slip.department.toLowerCase().includes(term)) ||
        (slip.designation && slip.designation.toLowerCase().includes(term))
      );
    }
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [salarySlips, searchTerm, sortConfig]);

  // Toggle row expansion
  const toggleRow = (employeeId) => {
    setExpandedRows(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    return {
      totalEmployees: filteredSlips.length,
      totalBaseSalary: filteredSlips.reduce(
        (sum, emp) => sum + parseFloat(salaryView === 'monthly' ? emp.baseSalaryMonthly : emp.baseSalaryYearly),
        0
      ),
      totalNetSalary: filteredSlips.reduce(
        (sum, emp) => sum + parseFloat(salaryView === 'monthly' ? emp.calculatedMonthly : emp.calculatedYearly),
        0
      ),
    };
  }, [filteredSlips, salaryView]);

  // File download handlers
  const handleDownloadCSV = () => {
    const dataForCSV = filteredSlips.map((slip) => ({
      ...slip,
      baseSalary: salaryView === 'monthly' ? slip.baseSalaryMonthly : slip.baseSalaryYearly,
      calculatedSalary: salaryView === 'monthly' ? slip.calculatedMonthly : slip.calculatedYearly,
    }));
    downloadCSV(dataForCSV, `salary_report_${month}_${year}_${salaryView}.csv`);
  };

  const handleDownloadAllSlips = () => {
    downloadAllSlipsAsZip(filteredSlips, month, year, totalDays, salaryView);
  };

  const handleDownloadReport = () => {
    const htmlContent = generateSalaryReportHTML(filteredSlips, month, year, salaryView);
    downloadHTMLAsFile(htmlContent, `salary_report_${month}_${year}_${salaryView}.html`);
  };

  const handleDownloadIndividualSlip = (employee) => {
    const htmlContent = generateSalarySlipHTML(employee, month, year, totalDays, salaryView);
    downloadHTMLAsFile(htmlContent, `salary_slip_${employee.name}_${month}_${year}_${salaryView}.html`);
  };

  const handlePreviewSlip = (employee) => {
    const htmlContent = generateSalarySlipHTML(employee, month, year, totalDays, salaryView);
    setPreviewSlip(htmlContent);
  };

  const closePreview = () => {
    setPreviewSlip(null);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const formatCurrency = (amount, showSymbol = true) => {
    return parseFloat(amount).toLocaleString('en-IN', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
 
  return (
    <SalarySlipList
      month={month}
      year={year}
      loading={loading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      viewMode={viewMode}
      setViewMode={setViewMode}
      salaryView={salaryView}
      setSalaryView={setSalaryView}
      previewSlip={previewSlip}
      sortConfig={sortConfig}
      requestSort={requestSort}
      expandedRows={expandedRows}
      toggleRow={toggleRow}
      filteredSlips={filteredSlips}
      salarySlips={salarySlips}
      totalDays={totalDays}
      summaryStats={summaryStats}
      handleDownloadCSV={handleDownloadCSV}
      handleDownloadAllSlips={handleDownloadAllSlips}
      handleDownloadReport={handleDownloadReport}
      handleDownloadIndividualSlip={handleDownloadIndividualSlip}
      handlePreviewSlip={handlePreviewSlip}
      closePreview={closePreview}
      clearSearch={clearSearch}
      formatCurrency={formatCurrency}
    />
  );
};

export default SalarySlipContainer;