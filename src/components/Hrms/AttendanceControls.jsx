import { Save, Plus } from 'lucide-react';

const AttendanceControls = ({ 
  selectedMonth, 
  selectedYear, 
  setSelectedMonth, 
  setSelectedYear,
  isEditing,
  setIsEditing,
  loading,
  handleSaveAttendance
}) => (
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
    {isEditing ? (
      <button 
        onClick={handleSaveAttendance}
        className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
        disabled={loading}
      >
        <Save size={16} /> {loading ? 'Saving...' : 'Save'}
      </button>
    ) : (
      <button 
        onClick={() => setIsEditing(true)}
        className="bg-black text-white px-3 py-1 rounded text-sm flex items-center gap-1"
      >
        <Plus size={16} /> Add Attendance
      </button>
    )}
  </div>
);

export default AttendanceControls;