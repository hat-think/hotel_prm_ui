import { useState } from 'react';

const AttendanceIcon = ({ status }) => {
  if (status === 1) return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-100 text-green-800 text-xs font-medium mx-auto">
      P
    </span>
  );
  if (status === 2) return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-yellow-100 text-yellow-800 text-xs font-medium mx-auto">
      H
    </span>
  );
  if (status === 0) return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-100 text-red-800 text-xs font-medium mx-auto">
      A
    </span>
  );
  return <span className="text-gray-400 w-4 h-4 mx-auto">-</span>;
};

const ColorfulSelect = ({ value, onChange, dayIndex, empIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    { value: '', label: '-', bg: 'bg-gray-100', text: 'text-gray-800' },
    { value: '1', label: 'P', bg: 'bg-green-100', text: 'text-green-800' },
    { value: '2', label: 'H', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    { value: '0', label: 'A', bg: 'bg-red-100', text: 'text-red-800' },
  ];

  const selectedOption = options.find(opt => opt.value === (value !== null ? value.toString() : '')) || options[0];

  const handleSelect = (optionValue) => {
    onChange(empIndex, dayIndex, optionValue !== '' ? Number(optionValue) : null);
    setIsOpen(false);
  };

  return (
    <div className="relative w-12 mx-auto">
      <button
        type="button"
        className={`w-full flex items-center justify-center rounded px-1 py-1 text-xs ${selectedOption.bg} ${selectedOption.text} border border-gray-300`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption.label}
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded border border-gray-200"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full flex items-center justify-center px-1 py-1 text-xs ${option.bg} ${option.text} hover:opacity-90`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === selectedOption.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AttendanceTable = ({ 
  attendanceData, 
  totalDays, 
  isEditing, 
  handleStatusChange,
}) => {
  const calculatePresentDays = (records) => {
    let presentDays = 0;
    let halfDays = 0;

    records.forEach(status => {
      if (status === 1) presentDays++;
      if (status === 2) halfDays++;
    });

    return presentDays + (halfDays * 0.5);
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
              <th className="text-right px-4 py-2 whitespace-nowrap sticky right-0 z-10 bg-gray-100">Days Present</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((emp, empIndex) => {
              const presentDays = calculatePresentDays(emp.records);
              
              return (
                <tr key={emp.employeeId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium whitespace-nowrap sticky left-0 z-10 bg-white">
                    {emp.name}
                  </td>
                  {emp.records.map((status, dayIndex) => (
                    <td key={dayIndex} className="text-center py-2 px-1">
                      {isEditing ? (
                        <ColorfulSelect
                          value={status}
                          onChange={handleStatusChange}
                          dayIndex={dayIndex}
                          empIndex={empIndex}
                        />
                      ) : (
                        <AttendanceIcon status={status} />
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right font-medium sticky right-0 z-10 bg-white">
                    {presentDays} / {totalDays}
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