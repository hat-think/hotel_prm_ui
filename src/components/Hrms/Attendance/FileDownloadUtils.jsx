export const downloadHTMLAsFile = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const downloadCSV = (data, fileName) => {
    const headers = ['Employee ID', 'Name', 'Present Days', 'Half Days', 'Absent Days', 'Base Salary', 'Net Salary'];
    const csvContent = [
      headers.join(','),
      ...data.map(emp => [
        emp.employeeId,
        emp.name,
        emp.presentDays,
        emp.halfDays,
        emp.absentDays,
        emp.baseSalary,
        emp.calculatedSalary
      ].join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const downloadAllSlipsAsZip = async (employees, month, year, totalDays) => {
    // In a real implementation, you would use a library like JSZip
    // This is a simplified version that downloads each slip individually
    // For a production app, implement proper ZIP file creation
    employees.forEach((emp, index) => {
      const htmlContent = generateSalarySlipHTML(emp, month, year, totalDays);
      downloadHTMLAsFile(htmlContent, `Salary_Slip_${emp.name}_${month}_${year}.html`);
    });
  };