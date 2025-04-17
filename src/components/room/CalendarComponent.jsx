// src/components/ReservationCalendar.jsx
import { useState } from 'react';

const ReservationCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 17));
  const [selectedReservations, setSelectedReservations] = useState([]);

  const rooms = [
    { id: 101, price: 8.41 },
    { id: 102, price: 8.43 },
    { id: 103, price: 8.40 },
    { id: 104, price: 8.40 },
  ];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const toggleReservation = (roomId, date) => {
    const exists = selectedReservations.some(
      (res) =>
        res.roomId === roomId &&
        res.date.toDateString() === date.toDateString()
    );

    if (exists) {
      setSelectedReservations((prev) =>
        prev.filter(
          (res) =>
            !(
              res.roomId === roomId &&
              res.date.toDateString() === date.toDateString()
            )
        )
      );
    } else {
      setSelectedReservations((prev) => [...prev, { roomId, date }]);
    }
  };

  const isSelected = (roomId, date) =>
    selectedReservations.some(
      (res) =>
        res.roomId === roomId &&
        res.date.toDateString() === date.toDateString()
    );

  const renderHeader = () => {
    const monthYear = currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg shadow-md text-white">
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
            ◀
          </button>
          <h2 className="text-xl font-semibold">{monthYear}</h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
            ▶
          </button>
        </div>
        <button
          className="px-4 py-1 bg-white text-indigo-600 font-medium rounded-md text-sm shadow hover:bg-gray-100"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
      </div>
    );
  };

  const renderDatesHeader = () => {
    const daysInMonth = getDaysInMonth();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return (
      <div className="flex border-b border-gray-300 bg-gray-100">
        <div className="w-32 font-semibold text-sm text-center py-2 border-r border-gray-300 bg-indigo-50 text-indigo-700">
          Room
        </div>
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const isToday =
            date === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={`date-${date}`}
              className={`flex-1 min-w-[45px] text-center py-2 border-r border-gray-300 ${
                isToday ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700'
              }`}
            >
              <div className="text-xs font-medium">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                  new Date(year, month, date).getDay()
                ]}
              </div>
              <div>{date}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRoomRow = (room) => {
    const daysInMonth = getDaysInMonth();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return (
      <div key={`room-${room.id}`} className="flex border-b border-gray-200 hover:bg-gray-50">
        <div className="w-32 px-3 py-2 border-r border-gray-300 bg-white text-center text-indigo-800 font-semibold shadow-inner">
          <div className="text-lg">{room.id}</div>
          <div className="text-xs text-gray-500">${room.price.toFixed(2)}</div>
        </div>

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const thisDate = new Date(year, month, date);
          const isSelectedDate = isSelected(room.id, thisDate);

          const isWeekend = thisDate.getDay() % 6 === 0;
          const isPast = thisDate < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={`slot-${room.id}-${date}`}
              className={`flex-1 min-w-[45px] p-1 text-center text-xs border-r border-gray-200 cursor-pointer transition duration-200 ${
                isPast
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isSelectedDate
                  ? 'bg-blue-200 border-blue-400 font-semibold text-blue-900'
                  : isWeekend
                  ? 'bg-orange-50 text-orange-600'
                  : 'hover:bg-blue-50'
              }`}
              onClick={() => {
                if (!isPast) {
                  toggleReservation(room.id, thisDate);
                }
              }}
            >
              {isSelectedDate && <div className="h-2 w-2 mx-auto bg-blue-600 rounded-full mt-1"></div>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      {renderHeader()}

      <div className="overflow-x-auto">
        {renderDatesHeader()}
        <div className="divide-y divide-gray-200">{rooms.map(renderRoomRow)}</div>
      </div>

      <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-300 font-medium">
        {selectedReservations.length > 0 ? (
          <div className="text-indigo-700">
            ✅ Selected:
            <ul className="list-disc list-inside mt-1">
              {selectedReservations.map((res, idx) => (
                <li key={idx}>
                  Room <strong>{res.roomId}</strong> on{' '}
                  {res.date.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          '📅 Click on dates to select multiple reservations.'
        )}
      </div>
    </div>
  );
};

export default ReservationCalendar;
