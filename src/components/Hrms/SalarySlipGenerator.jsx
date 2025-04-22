import React, { useEffect, useState } from 'react';
import { getEmployeeList, getAttendance } from './api';
import { Download, Printer, User, Search } from 'lucide-react';

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const SalarySlipGenerator = ({ month, year }) => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'individual'
  const [totalDays, setTotalDays] = useState(getDaysInMonth(month, year));

  useEffect(() => {
    setTotalDays(getDaysInMonth(month, year));
  }, [month, year]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        const [empResponse, attResponse] = await Promise.all([
          getEmployeeList(),
          getAttendance(month, year)
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

          const dailySalary = emp.salary / totalDays;
          const calculatedSalary = (dailySalary * (presentDays + halfDays * 0.5)).toFixed(2);

          return {
            name: emp.name,
            employeeId: emp.employeeId,
            presentDays,
            halfDays,
            absentDays,
            baseSalary: emp.salary.toLocaleString(),
            calculatedSalary: parseFloat(calculatedSalary).toLocaleString(),
            rawSalary: parseFloat(calculatedSalary),
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

  const filteredSlips = salarySlips.filter(slip =>
    slip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printAllSlips = () => {
    const printWindow = window.open('', '_blank');
    const date = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    let slipsHTML = '';
    filteredSlips.forEach(employee => {
      slipsHTML += `
        <div class="salary-slip" style="page-break-after: always; margin-bottom: 20px;">
          <div class="header">
            <div class="company-name">ACME CORPORATION</div>
            <div class="company-address">123 Business Street, City, Country</div>
          </div>
          
          <div class="slip-title">SALARY SLIP - ${date}</div>
          
          <div class="employee-info">
            <div>
              <strong>Employee Name:</strong> ${employee.name}<br>
              <strong>Employee ID:</strong> ${employee.employeeId}
            </div>
            <div>
              <strong>Month:</strong> ${date}<br>
              <strong>Date Generated:</strong> ${new Date().toLocaleDateString()}
            </div>
          </div>
          
          <table class="details-table">
            <tr>
              <th>Description</th>
              <th>Days</th>
              <th>Amount (₹)</th>
            </tr>
            <tr>
              <td>Base Salary</td>
              <td>${totalDays} days</td>
              <td>${employee.baseSalary}</td>
            </tr>
            <tr>
              <td>Present Days (${employee.dailySalary}/day)</td>
              <td>${employee.presentDays}</td>
              <td>+${(employee.presentDays * employee.dailySalary).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Half Days (${(employee.dailySalary * 0.5).toFixed(2)}/day)</td>
              <td>${employee.halfDays}</td>
              <td>+${(employee.halfDays * employee.dailySalary * 0.5).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Absent Days (${employee.dailySalary}/day)</td>
              <td>${employee.absentDays}</td>
              <td>-${(employee.absentDays * employee.dailySalary).toFixed(2)}</td>
            </tr>
            <tr style="font-weight: bold;">
              <td colspan="2">Net Salary Payable</td>
              <td>₹${employee.calculatedSalary}</td>
            </tr>
          </table>
          
          <div class="signature">
            <div>Employee Signature</div>
            <div>Authorized Signature</div>
          </div>
          
          <div class="footer">
            This is computer generated document and does not require signature
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Salary Slips - ${date}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .salary-slip { max-width: 800px; margin: 0 auto 20px; border: 2px solid #000; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .company-address { font-size: 14px; color: #555; }
            .slip-title { font-size: 20px; text-align: center; margin: 15px 0; border-bottom: 1px solid #000; padding-bottom: 10px; }
            .employee-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; }
            .details-table th { background-color: #f2f2f2; text-align: left; }
            .signature { margin-top: 40px; display: flex; justify-content: space-between; }
            .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #777; }
            @page { size: A4; margin: 10mm; }
          </style>
        </head>
        <body>
          ${slipsHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    const date = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Salary Report - ${date}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .present { background-color: #e6ffed; }
            .half-day { background-color: #fff7e6; }
            .absent { background-color: #ffe6e6; }
            .text-green { color: #28a745; }
            .text-red { color: #dc3545; }
            @page { size: auto; margin: 5mm; }
          </style>
        </head>
        <body>
          <h1>Salary Report - ${date}</h1>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Present</th>
                <th>Half Day</th>
                <th>Absent</th>
                <th>Base Salary</th>
                <th>Net Salary</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSlips.map(slip => `
                <tr>
                  <td>${slip.name} (${slip.employeeId})</td>
                  <td class="present">${slip.presentDays}</td>
                  <td class="half-day">${slip.halfDays}</td>
                  <td class="absent">${slip.absentDays}</td>
                  <td>₹${slip.baseSalary}</td>
                  <td class="${slip.rawSalary === 0 ? 'text-red' : 'text-green'}">₹${slip.calculatedSalary}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadCSV = () => {
    const headers = ['Employee ID', 'Name', 'Present Days', 'Half Days', 'Absent Days', 'Base Salary', 'Net Salary'];
    const csvContent = [
      headers.join(','),
      ...filteredSlips.map(slip => [
        slip.employeeId,
        slip.name,
        slip.presentDays,
        slip.halfDays,
        slip.absentDays,
        slip.baseSalary,
        slip.calculatedSalary
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `salary_slips_${month}_${year}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mt-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 no-print">
        <h2 className="text-2xl font-bold text-gray-800">
          Salary Slips - {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode(viewMode === 'table' ? 'individual' : 'table')}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              {viewMode === 'table' ? 'Individual Slips' : 'Table View'}
            </button>
            <button 
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
            <button 
              onClick={viewMode === 'table' ? printTable : printAllSlips}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Printer className="h-5 w-5" />
              Print All
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSlips.length > 0 ? (
        viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Half Day</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSlips.map((slip, i) => (
                  <tr key={i} className={slip.rawSalary === 0 ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{slip.name}</div>
                      <div className="text-sm text-gray-500">{slip.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slip.presentDays > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {slip.presentDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slip.halfDays > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {slip.halfDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slip.absentDays > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {slip.absentDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                      ₹{slip.baseSalary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                      <span className={slip.rawSalary === 0 ? 'text-red-600' : 'text-green-600'}>
                        ₹{slip.calculatedSalary}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium no-print">
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          const date = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                          
                          printWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>Salary Slip - ${slip.name}</title>
                                <style>
                                  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                                  .salary-slip { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
                                  .header { text-align: center; margin-bottom: 20px; }
                                  .company-name { font-size: 24px; font-weight: bold; }
                                  .company-address { font-size: 14px; color: #555; }
                                  .slip-title { font-size: 20px; text-align: center; margin: 15px 0; }
                                  .employee-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                                  .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                                  .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; }
                                  .details-table th { background-color: #f2f2f2; text-align: left; }
                                  .signature { margin-top: 40px; display: flex; justify-content: space-between; }
                                  .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #777; }
                                  @page { size: A4; margin: 10mm; }
                                </style>
                              </head>
                              <body>
                                <div class="salary-slip">
                                  <div class="header">
                                    <div class="company-name">ACME CORPORATION</div>
                                    <div class="company-address">123 Business Street, City, Country</div>
                                  </div>
                                  
                                  <div class="slip-title">SALARY SLIP - ${date}</div>
                                  
                                  <div class="employee-info">
                                    <div>
                                      <strong>Employee Name:</strong> ${slip.name}<br>
                                      <strong>Employee ID:</strong> ${slip.employeeId}
                                    </div>
                                    <div>
                                      <strong>Month:</strong> ${date}<br>
                                      <strong>Date Generated:</strong> ${new Date().toLocaleDateString()}
                                    </div>
                                  </div>
                                  
                                  <table class="details-table">
                                    <tr>
                                      <th>Description</th>
                                      <th>Days</th>
                                      <th>Amount (₹)</th>
                                    </tr>
                                    <tr>
                                      <td>Base Salary</td>
                                      <td>${totalDays} days</td>
                                      <td>${slip.baseSalary}</td>
                                    </tr>
                                    <tr>
                                      <td>Present Days (${slip.dailySalary}/day)</td>
                                      <td>${slip.presentDays}</td>
                                      <td>+${(slip.presentDays * slip.dailySalary).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                      <td>Half Days (${(slip.dailySalary * 0.5).toFixed(2)}/day)</td>
                                      <td>${slip.halfDays}</td>
                                      <td>+${(slip.halfDays * slip.dailySalary * 0.5).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                      <td>Absent Days (${slip.dailySalary}/day)</td>
                                      <td>${slip.absentDays}</td>
                                      <td>-${(slip.absentDays * slip.dailySalary).toFixed(2)}</td>
                                    </tr>
                                    <tr style="font-weight: bold;">
                                      <td colspan="2">Net Salary Payable</td>
                                      <td>₹${slip.calculatedSalary}</td>
                                    </tr>
                                  </table>
                                  
                                  <div class="signature">
                                    <div>Employee Signature</div>
                                    <div>Authorized Signature</div>
                                  </div>
                                  
                                  <div class="footer">
                                    This is computer generated document and does not require signature
                                  </div>
                                </div>
                                <script>
                                  setTimeout(() => {
                                    window.print();
                                    window.close();
                                  }, 200);
                                </script>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSlips.map((slip, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{slip.name}</h3>
                    <p className="text-gray-600 text-sm">ID: {slip.employeeId}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      const date = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                      
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Salary Slip - ${slip.name}</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                              .salary-slip { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
                              .header { text-align: center; margin-bottom: 20px; }
                              .company-name { font-size: 24px; font-weight: bold; }
                              .company-address { font-size: 14px; color: #555; }
                              .slip-title { font-size: 20px; text-align: center; margin: 15px 0; }
                              .employee-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                              .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                              .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; }
                              .details-table th { background-color: #f2f2f2; text-align: left; }
                              .signature { margin-top: 40px; display: flex; justify-content: space-between; }
                              .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #777; }
                              @page { size: A4; margin: 10mm; }
                            </style>
                          </head>
                          <body>
                            <div class="salary-slip">
                              <div class="header">
                                <div class="company-name">ACME CORPORATION</div>
                                <div class="company-address">123 Business Street, City, Country</div>
                              </div>
                              
                              <div class="slip-title">SALARY SLIP - ${date}</div>
                              
                              <div class="employee-info">
                                <div>
                                  <strong>Employee Name:</strong> ${slip.name}<br>
                                  <strong>Employee ID:</strong> ${slip.employeeId}
                                </div>
                                <div>
                                  <strong>Month:</strong> ${date}<br>
                                  <strong>Date Generated:</strong> ${new Date().toLocaleDateString()}
                                </div>
                              </div>
                              
                              <table class="details-table">
                                <tr>
                                  <th>Description</th>
                                  <th>Days</th>
                                  <th>Amount (₹)</th>
                                </tr>
                                <tr>
                                  <td>Base Salary</td>
                                  <td>${totalDays} days</td>
                                  <td>${slip.baseSalary}</td>
                                </tr>
                                <tr>
                                  <td>Present Days (${slip.dailySalary}/day)</td>
                                  <td>${slip.presentDays}</td>
                                  <td>+${(slip.presentDays * slip.dailySalary).toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>Half Days (${(slip.dailySalary * 0.5).toFixed(2)}/day)</td>
                                  <td>${slip.halfDays}</td>
                                  <td>+${(slip.halfDays * slip.dailySalary * 0.5).toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>Absent Days (${slip.dailySalary}/day)</td>
                                  <td>${slip.absentDays}</td>
                                  <td>-${(slip.absentDays * slip.dailySalary).toFixed(2)}</td>
                                </tr>
                                <tr style="font-weight: bold;">
                                  <td colspan="2">Net Salary Payable</td>
                                  <td>₹${slip.calculatedSalary}</td>
                                </tr>
                              </table>
                              
                              <div class="signature">
                                <div>Employee Signature</div>
                                <div>Authorized Signature</div>
                              </div>
                              
                              <div class="footer">
                                This is computer generated document and does not require signature
                              </div>
                            </div>
                            <script>
                              setTimeout(() => {
                                window.print();
                                window.close();
                              }, 200);
                            </script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div className="bg-green-100 p-2 rounded text-center">
                    <div className="font-semibold">Present</div>
                    <div>{slip.presentDays} days</div>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded text-center">
                    <div className="font-semibold">Half Day</div>
                    <div>{slip.halfDays} days</div>
                  </div>
                  <div className="bg-red-100 p-2 rounded text-center">
                    <div className="font-semibold">Absent</div>
                    <div>{slip.absentDays} days</div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between mb-1">
                    <span>Base Salary:</span>
                    <span className="font-medium">₹{slip.baseSalary}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Salary:</span>
                    <span className={slip.rawSalary === 0 ? 'text-red-600' : 'text-green-600'}>
                      ₹{slip.calculatedSalary}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No salary data available for the selected criteria</p>
        </div>
      )}

      {filteredSlips.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 no-print">
          Showing {filteredSlips.length} of {salarySlips.length} employees
        </div>
      )}
    </div>
  );
};

export default SalarySlipGenerator;