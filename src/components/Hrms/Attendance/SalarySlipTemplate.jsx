export const generateSalarySlipHTML = (employee, month, year, totalDays, viewType = 'monthly') => {
  const date = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const isMonthly = viewType === 'monthly';
  
  const baseSalary = isMonthly ? employee.baseSalaryMonthly : employee.baseSalaryYearly;
  const calculatedSalary = isMonthly ? employee.calculatedMonthly : employee.calculatedYearly;
  const salaryLabel = isMonthly ? 'Monthly Salary' : 'Annual Salary';
  const dailyRate = isMonthly ? employee.dailySalary : (employee.dailySalary * totalDays / 365 * 12).toFixed(2);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Salary Slip - ${employee.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .salary-slip { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
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
          .highlight { background-color: #f8f9fa; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="salary-slip">
          <div class="header">
            <div class="company-name">ACME CORPORATION</div>
            <div class="company-address">123 Business Street, City, Country</div>
          </div>
          
          <div class="slip-title">SALARY SLIP - ${date} (${viewType})</div>
          
          <div class="employee-info">
            <div>
              <strong>Employee Name:</strong> ${employee.name}<br>
              <strong>Employee ID:</strong> ${employee.employeeId}
            </div>
            <div>
              <strong>Period:</strong> ${date}<br>
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
              <td>Base ${salaryLabel}</td>
              <td>${isMonthly ? totalDays + ' days' : '365 days'}</td>
              <td>${parseFloat(baseSalary).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td>Present Days (${dailyRate}/day)</td>
              <td>${employee.presentDays}</td>
              <td>+${(employee.presentDays * dailyRate).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Half Days (${(dailyRate * 0.5).toFixed(2)}/day)</td>
              <td>${employee.halfDays}</td>
              <td>+${(employee.halfDays * dailyRate * 0.5).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Absent Days (${dailyRate}/day)</td>
              <td>${employee.absentDays}</td>
              <td>-${(employee.absentDays * dailyRate).toFixed(2)}</td>
            </tr>
            <tr class="highlight">
              <td colspan="2">Net ${salaryLabel} Payable</td>
              <td>₹${parseFloat(calculatedSalary).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
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
      </body>
    </html>
  `;
};

export const generateSalaryReportHTML = (employees, month, year, viewType = 'monthly') => {
  const date = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const isMonthly = viewType === 'monthly';
  const salaryLabel = isMonthly ? 'Monthly' : 'Yearly';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Salary Report - ${date} (${viewType})</title>
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
          .summary { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
          .summary-item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .summary-total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Salary Report - ${date} (${viewType} View)</h1>
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
            ${employees.map(emp => {
              const baseSalary = isMonthly ? emp.baseSalaryMonthly : emp.baseSalaryYearly;
              const calculatedSalary = isMonthly ? emp.calculatedMonthly : emp.calculatedYearly;
              const isZeroSalary = calculatedSalary === 0;
              
              return `
                <tr>
                  <td>${emp.name} (${emp.employeeId})</td>
                  <td class="present">${emp.presentDays}</td>
                  <td class="half-day">${emp.halfDays}</td>
                  <td class="absent">${emp.absentDays}</td>
                  <td>₹${parseFloat(baseSalary).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                  <td class="${isZeroSalary ? 'text-red' : 'text-green'}">
                    ₹${parseFloat(calculatedSalary).toLocaleString('en-IN', {maximumFractionDigits: 2})}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-item">
            <span>Total Employees:</span>
            <span>${employees.length}</span>
          </div>
          <div class="summary-item">
            <span>Total Base Salary:</span>
            <span>₹${employees.reduce((sum, emp) => sum + parseFloat(isMonthly ? emp.baseSalaryMonthly : emp.baseSalaryYearly), 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
          </div>
          <div class="summary-item">
            <span>Total Net Salary:</span>
            <span>₹${employees.reduce((sum, emp) => sum + parseFloat(isMonthly ? emp.calculatedMonthly : emp.calculatedYearly), 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
          </div>
          <div class="summary-item summary-total">
            <span>Total Deductions:</span>
            <span>₹${employees.reduce((sum, emp) => {
              const base = parseFloat(isMonthly ? emp.baseSalaryMonthly : emp.baseSalaryYearly);
              const net = parseFloat(isMonthly ? emp.calculatedMonthly : emp.calculatedYearly);
              return sum + (base - net);
            }, 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
          </div>
        </div>
      </body>
    </html>
  `;
};