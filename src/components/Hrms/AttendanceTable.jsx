import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const AttendanceIcon = ({ status }) => {
  if (status === 1) return <CheckCircle2 className="text-green-500 w-4 h-4 mx-auto" />;
  if (status === 2) return <Clock className="text-yellow-500 w-4 h-4 mx-auto" />;
  if (status === 0) return <XCircle className="text-red-500 w-4 h-4 mx-auto" />;
  return <span className="text-gray-400 w-4 h-4 mx-auto">-</span>;
};

const AttendanceTable = ({ 
  attendanceData, 
  totalDays, 
  isEditing, 
  handleStatusChange,
  employees
}) => {
  const calculateSalary = (employee, records) => {
    if (!employee.salary) return 0;
    
    const workingDays = records.length;
    const dailySalary = employee.salary / workingDays;
    
    let presentDays = 0;
    let halfDays = 0;

    records.forEach(status => {
      if (status === 1) presentDays++;
      if (status === 2) halfDays++;
    });

    return (presentDays * dailySalary) + (halfDays * dailySalary * 0.5);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-md relative">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 whitespace-nowrap sticky left-0 z-10 bg-gray-100">Employee</th>
              {Array.from({ length: totalDays }, (_, i) => (
                <th key={i + 1} className="text-center px-2 py-2 whitespace-nowrap">{i + 1}</th>
              ))}
              <th className="text-right px-4 py-2 whitespace-nowrap sticky right-0 z-10 bg-gray-100">Salary</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((emp, empIndex) => {
              const employee = employees.find(e => e.employeeId === emp.employeeId);
              const salary = employee ? calculateSalary(employee, emp.records) : 0;
              
              return (
                <tr key={emp.employeeId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium whitespace-nowrap sticky left-0 z-10 bg-white">
                    {emp.name}
                  </td>
                  {emp.records.map((status, dayIndex) => (
                    <td key={dayIndex} className="text-center py-2 px-1">
                      {isEditing ? (
                        <select
                          value={status !== null ? status : ''}
                          onChange={(e) => handleStatusChange(empIndex, dayIndex, Number(e.target.value))}
                          className="border rounded px-1 py-1 text-xs w-12"
                        >
                          <option value="">-</option>
                          <option value="1">P</option>
                          <option value="2">H</option>
                          <option value="0">A</option>
                        </select>
                      ) : (
                        <AttendanceIcon status={status} />
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right font-medium sticky right-0 z-10 bg-white">
                    ₹{salary.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;